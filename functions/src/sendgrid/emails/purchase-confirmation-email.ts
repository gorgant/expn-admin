import { Order } from "../../../../shared-models/orders/order.model";
import { ProductEmailTemplates, EmailSenderAddresses, EmailSenderNames, EmailCategories, AdminEmailAddresses } from "../../../../shared-models/email/email-vars.model";
import { getSgMail } from "../config";
import { getProductUrlById, currentEnvironmentType } from "../../environments/config";
import { EnvironmentTypes } from "../../../../shared-models/environments/env-vars.model";
import { MailData } from "@sendgrid/helpers/classes/mail";

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

export const sendPurchaseConfirmationEmail = async (order: Order) => {

  console.log('Sending Purchase Confirmation Email to this subscriber', order.email);

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
      bccEmail = AdminEmailAddresses.EXPLEARNING_DEFAULT;
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