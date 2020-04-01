import * as functions from 'firebase-functions';
import { Order } from '../../../shared-models/orders/order.model';
import { adminFirestore } from '../config/db-config';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { EmailCategories } from '../../../shared-models/email/email-vars.model';
import { adminProjectId } from '../config/environments-config';
import { PubSub } from '@google-cloud/pubsub';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';

const pubSub = new PubSub();

// Trigger email send
const triggerPurchaseConfirmationEmail = async(order: Order) => {
  const topicName = AdminTopicNames.TRIGGER_EMAIL_SEND_TOPIC;
  const projectId = adminProjectId;
  const emailCategory = EmailCategories.PURCHASE_CONFIRMATION;
  const topic = pubSub.topic(`projects/${projectId}/topics/${topicName}`);
  const pubsubMsg: EmailPubMessage = {
    emailCategory,
    order
  }
  const topicPublishRes = await topic.publishJSON(pubsubMsg)
    .catch(err => {console.log(`Failed to publish to topic "${topicName}" on project "${projectId}":`, err); throw new functions.https.HttpsError('internal', err);});
  console.log(`Publish to topic "${topicName}" on project "${projectId}" succeeded:`, topicPublishRes);
}

const executeActions = async (order: Order) => {
  const db = adminFirestore;

  // Store order
  const orderFbRes = await db.collection(AdminCollectionPaths.ORDERS).doc(order.id).set(order)
    .catch(err => {console.log(`Failed to store order in admin database:`, err); throw new functions.https.HttpsError('internal', err);});
  console.log('Order stored in admin database:', orderFbRes);
  
  // Also update subscriber with order data
  const subOrderFbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(order.email)
    .collection(AdminCollectionPaths.ORDERS).doc(order.id)
    .set(order)
    .catch(err => {console.log(`Failed to update subscriber order data in admin database:`, err); throw new functions.https.HttpsError('internal', err);});
  console.log('Subscriber updated with order data', subOrderFbRes);  

  // Trigger purchase confirmation email
  await triggerPurchaseConfirmationEmail(order);
}

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeOrder = functions.pubsub.topic(AdminTopicNames.SAVE_ORDER_TOPIC).onPublish( async (message, context) => {

  const order = message.json as Order;
  console.log('Store order request received with this data:', order);
  console.log('Context from pubsub:', context);

  return executeActions(order);
})



