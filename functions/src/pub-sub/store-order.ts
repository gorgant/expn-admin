import * as functions from 'firebase-functions';
import { Order } from '../../../shared-models/orders/order.model';
import { adminFirestore } from '../db';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { EmailCategories } from '../../../shared-models/email/email-vars.model';
import { adminProjectId } from '../environments/config';
import { PubSub } from '@google-cloud/pubsub';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';

const pubSub = new PubSub();

// Trigger email send
const triggerPurchaseConfirmationEmail = async(order: Order) => {
  const topicName = AdminTopicNames.TRIGGER_EMAIL_SEND_TOPIC;
  const emailCategory = EmailCategories.PURCHASE_CONFIRMATION;
  const topic = pubSub.topic(`projects/${adminProjectId}/topics/${topicName}`);
  const pubsubMsg: EmailPubMessage = {
    emailCategory,
    order
  }
  const topicPublishRes = await topic.publishJSON(pubsubMsg)
    .catch(err => {throw new Error(`Publish to topic ${topicName} failed with error: ${err}`)});
  console.log(`Res from ${topicName}: ${topicPublishRes}`);
}

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeOrder = functions.pubsub.topic(AdminTopicNames.SAVE_ORDER_TOPIC).onPublish( async (message, context) => {
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

  // Trigger purchase confirmation email
  await triggerPurchaseConfirmationEmail(order)
    .catch(error => {throw new Error(`Error publishing purchase confirmation topic to admin: ${error}`)});

  // await sendOrderConfirmationEmail(order)
  //   .catch(error => console.log('Error sending contact form email', error));    

  return fbRes && subOrderFbRes;
})



