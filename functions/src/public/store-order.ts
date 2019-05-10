import * as functions from 'firebase-functions';
import { Order } from '../../../shared-models/orders/order.model';
import { adminFirestore } from '../db';
import { FbCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for order messages 
export const saveOrderInFirestore = functions.pubsub.topic('save-order').onPublish( async (message, context) => {
  const db = adminFirestore;

  console.log('Raw message from pubsub', message);
  console.log('Context from pubsub', context);
  const order = message.json as Order;
  console.log('Message converted to order', order);

  const fbRes = await db.collection(FbCollectionPaths.ORDERS).doc().set(order)
    .catch(error => console.log(error));
    console.log('Order stored', fbRes);
    return fbRes;
})



