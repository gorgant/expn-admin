import * as functions from 'firebase-functions';
import { Order } from '../../../shared-models/orders/order.model';
import { adminFirestore } from '../db';
import { FbCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for order messages 
export const saveOrderInFirestore = functions.pubsub.topic('save-order').onPublish( async (message, context) => {
  const db = adminFirestore;

  console.log('Context from pubsub', context);
  const order = message.json as Order;
  console.log('Message converted to order', order);

  // Add ID and order number to new order
  const orderDoc = await db.collection(FbCollectionPaths.ORDERS).doc().get();
  const orderId = orderDoc.id;
  const orderNumber = orderId.substring(orderId.length - 8, orderId.length); // Create a user friendly 8 digit order ID

  const orderWithId: Order = {
    ...order,
    id: orderId,
    orderNumber
  }

  console.log('Order with ID', orderWithId);
  
  const fbRes = await db.collection(FbCollectionPaths.ORDERS).doc(orderId).set(orderWithId)
    .catch(error => console.log(error));
    console.log('Order stored', fbRes);

  return fbRes;
})



