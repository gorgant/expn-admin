import * as functions from 'firebase-functions';
import { Order } from '../../../shared-models/orders/order.model';
import { adminFirestore } from '../db';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { AdminFunctionNames } from '../../../shared-models/routes-and-paths/fb-function-names';

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

    // TODO: Send email to customer with product intro, bcc greg@myexplearning

  return fbRes && subOrderFbRes;
})



