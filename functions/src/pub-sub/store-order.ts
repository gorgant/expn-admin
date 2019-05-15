import * as functions from 'firebase-functions';
import { Order } from '../../../shared-models/orders/order.model';
import { adminFirestore } from '../db';
import { FbCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for order messages 
export const storeOrder = functions.pubsub.topic('save-order').onPublish( async (message, context) => {
  const db = adminFirestore;

  console.log('Context from pubsub', context);
  const order = message.json as Order;
  console.log('Message from pubsub', order);

 
  const fbRes = await db.collection(FbCollectionPaths.ORDERS).doc(order.id).set(order)
    .catch(error => console.log(error));
    console.log('Order stored', fbRes);

  return fbRes;
})



