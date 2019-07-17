import * as functions from 'firebase-functions';
import { Order } from '../../../shared-models/orders/order.model';
import { adminFirestore } from '../db';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { AdminFunctionNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { getSgMail, getProductUrlById } from '../sendgrid/config';
import { EmailSenderAddresses, EmailSenderNames, AdminEmailAddresses, EmailCategories, ProductEmailTemplates } from '../../../shared-models/email/email-vars.model';
import { currentEnvironmentType } from '../environments/config';
import { EnvironmentTypes } from '../../../shared-models/environments/env-vars.model';
import { MailData } from '@sendgrid/helpers/classes/mail';

const getProductEmailTemplateIdFromProductId = (order: Order): string => {
  try {
    // Fetch the template based on the product ID
    const template = ProductEmailTemplates[order.productId].templateId;
    return template;
  } catch(error) {
    console.log(`Error fetching email template from product id ${order.productId}`, error);
    return error;
  }
}

const sendOrderConfirmationEmail = async (order: Order) => {
  const sgMail = getSgMail();
  const fromEmail = EmailSenderAddresses.EXPLEARNING_ORDERS;
  const fromName = EmailSenderNames.EXPLEARNING_DEFAULT;
  const toFirstName = order.firstName;
  let toEmail: string;
  let bccEmail: string;
  const templateId = getProductEmailTemplateIdFromProductId(order);
  let categories: string[];
  const productUrl: string = getProductUrlById(order.productId);

  // Prevents test emails from going to the actual address used
  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      toEmail = order.email;
      categories = [EmailCategories.PURCHASE_CONFIRMATION];
      bccEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      break;
    case EnvironmentTypes.SANDBOX:
      toEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      categories = [EmailCategories.PURCHASE_CONFIRMATION, EmailCategories.TEST_SEND];
      bccEmail = '';
      break;
    default:
      toEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      categories = [EmailCategories.PURCHASE_CONFIRMATION, EmailCategories.TEST_SEND];
      bccEmail = '';
      break;
  }

  const msg: MailData = {
    to: {
      email: toEmail,
      name: toFirstName
    },
    from: {
      email: fromEmail,
      name: fromName,
    },
    bcc: bccEmail,
    templateId,
    dynamicTemplateData: {
      firstName: toFirstName, // Will populate first name greeting if name exists
      orderNumber: order.orderNumber,
      productUrl
    },
    categories,
    customArgs: {
      productId: order.productId,
      orderId: order.id
    }
  };
  await sgMail.send(msg)
    .catch(err => console.log(`Error sending email: ${msg} because `, err));

  console.log('Email sent', msg);
}

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeOrder = functions.pubsub.topic(AdminFunctionNames.SAVE_ORDER_TOPIC).onPublish( async (message, context) => {
  const db = adminFirestore;

  console.log('Context from pubsub', context);
  const order = message.json as Order;
  console.log('Message from pubsub', order);

 
  const fbRes = await db.collection(AdminCollectionPaths.ORDERS).doc(order.id).set(order)
    .catch(error => console.log(error));
    console.log('Order stored', fbRes);
  
  // Also update subscriber with order data
  const subOrderFbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(order.email)
    .collection(AdminCollectionPaths.ORDERS).doc(order.id)
    .set(order)
    .catch(error => {
      console.log('Error storing subscriber order', error)
      return error;
    });
    console.log('Order stored', subOrderFbRes);  

  await sendOrderConfirmationEmail(order)
    .catch(error => console.log('Error sending contact form email', error));    

  return fbRes && subOrderFbRes;
})



