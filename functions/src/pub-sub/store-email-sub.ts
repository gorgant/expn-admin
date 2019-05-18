import * as functions from 'firebase-functions';
import { adminFirestore } from '../db';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { EmailSubscriber } from '../../../shared-models/subscribers/email-subscriber.model';
import { now } from 'moment';
import { OrderHistory } from '../../../shared-models/orders/order-history.model';
import { AdminFunctionNames } from '../../../shared-models/routes-and-paths/fb-function-names';

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeEmailSub = functions.pubsub.topic(AdminFunctionNames.SAVE_EMAIL_SUB_TOPIC).onPublish( async (message, context) => {

  console.log('Context from pubsub', context);
  const subscriber = message.json as EmailSubscriber;
  console.log('Message from pubsub', subscriber);

  const subId = subscriber.id;

  const db = adminFirestore;
  const subDoc: FirebaseFirestore.DocumentSnapshot = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).get()
    .catch(error => {
      console.log('Error fetching subscriber doc', error)
      return error;
    });

  let fbRes;

  const orderId = subscriber.lastOrder ? subscriber.lastOrder.id : null; // Check if subscriber has a current order
  if (subDoc.exists) {

    // Actions if subscriber does exist

    const oldSubData: EmailSubscriber = subDoc.data() as EmailSubscriber;
    
    // Merge lastSubSource to the existing subscriptionSources array
    const existingSubSources = oldSubData.subscriptionSources; // Fetch existing sub sources
    const updatedSubSources = [...existingSubSources, subscriber.lastSubSource];
    
    // Merge lastOrder to the existing orderHistory object (key = order ID) if it exists
    const existingOrderHistory = oldSubData.orderHistory ? oldSubData.orderHistory : null; // Check if subscriber has previous order history
    let updatedOrderHistory = existingOrderHistory ? {...existingOrderHistory} : null; // Pre-load exisiting order history if available
    if (orderId) {
      // If order is present on latest subscriber request, add it to the object
      if (!updatedOrderHistory) {
        // First create a new object if it doesn't exist
        updatedOrderHistory = {};
      }
      updatedOrderHistory[orderId] = subscriber.lastOrder;
    }

    const updatedSubscriber: EmailSubscriber = {
      ...subscriber,
      subscriptionSources: updatedSubSources,
      orderHistory: updatedOrderHistory as OrderHistory
    }
    console.log('Updating subscriber with this data', updatedSubscriber);

    fbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).update(updatedSubscriber)
      .catch(error => {
        console.log('Error storing subscriber doc', error)
        return error;
      });
      console.log('Existing subscriber updated', fbRes);
  } else {

    // Actions if subscriber doesn't exist

    let orderHistory: any;
    if (orderId) {
      orderHistory = {};
      orderHistory[orderId] = subscriber.lastOrder;
    } else {
      orderHistory = null;
    }

    // Create new subscriber with a fresh subscriptionSource array
    const newSubscriber: EmailSubscriber = {
      ...subscriber,
      subscriptionSources: [subscriber.lastSubSource],
      orderHistory: orderHistory as OrderHistory,
      createdDate: now()
    };
    console.log('Creating subscriber with this data', newSubscriber);

    fbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).set(newSubscriber)
      .catch(error => {
        console.log('Error storing subscriber doc', error)
        return error;
      });

    console.log('New subscriber created', fbRes);
  }

  return fbRes;
})



