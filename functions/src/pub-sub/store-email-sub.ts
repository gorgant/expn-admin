import * as functions from 'firebase-functions';
import { adminFirestore } from '../db';
import { FbCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { EmailSubscriber } from '../../../shared-models/subscribers/email-subscriber.model';
import { now } from 'moment';

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeEmailSub = functions.pubsub.topic('save-email-sub').onPublish( async (message, context) => {

  console.log('Context from pubsub', context);
  const subscriber = message.json as EmailSubscriber;
  console.log('Message from pubsub', subscriber);

  const subId = subscriber.id;

  const db = adminFirestore;
  const subDoc: FirebaseFirestore.DocumentSnapshot = await db.collection(FbCollectionPaths.SUBSCRIBERS).doc(subId).get()
    .catch(error => {
      console.log('Error fetching subscriber doc', error)
      return error;
    });

  let fbRes;

  if (subDoc.exists) {
    // If doc already exists, merge with existing doc, adding the lastSubSource to the existing array
    const oldSubData: EmailSubscriber = subDoc.data() as EmailSubscriber;
    const existingSubSources = oldSubData.subscriptionSources; // Fetch existing sub sources
    const updatedSubscriber: EmailSubscriber = {
      ...subscriber,
      subscriptionSources: [...existingSubSources, subscriber.lastSubSource]
    }
    fbRes = await db.collection(FbCollectionPaths.SUBSCRIBERS).doc(subId).update(updatedSubscriber)
      .catch(error => {
        console.log('Error storing subscriber doc', error)
        return error;
      });
      console.log('Existing subscriber updated', fbRes);
  } else {
    // If doc does not exist, create new subscriber with a fresh subscriptionSource array
    const newSubscriber: EmailSubscriber = {
      ...subscriber,
      subscriptionSources: [subscriber.lastSubSource],
      createdDate: now()
    };
    fbRes = await db.collection(FbCollectionPaths.SUBSCRIBERS).doc(subId).set(newSubscriber)
      .catch(error => {
        console.log('Error storing subscriber doc', error)
        return error;
      });

    console.log('New subscriber created', fbRes);
  }

  return fbRes;
})



