import * as functions from 'firebase-functions';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { EmailSubscriberKeys, EmailSubscriber } from '../../../shared-models/subscribers/email-subscriber.model';
import { SubCountData } from '../../../shared-models/subscribers/sub-count-data.model';
import { adminFirestore } from '../config/db-config';
import { assertUID } from '../config/global-helpers';
import { getSendgridContactCount } from '../sendgrid/get-sendgrid-sub-count';

const adminDb = adminFirestore;

const getDbSubscriberCount = async () => {

  const subCollectionPath = AdminCollectionPaths.SUBSCRIBERS;
  const subCollection = await adminDb.collection(subCollectionPath)
    .where(`${EmailSubscriberKeys.OPT_IN_CONFIRMED}`, '==', true)
    .get()
    .catch(err => {functions.logger.log(`Error fetching subscriber collection from admin database:`, err); throw new functions.https.HttpsError('internal', err);});

  const dbSubCount = subCollection.size;

  // Could also use filter here, but this is a cool way to create a new array of the actual sub (rather than the docRef)
  const dbUnsubCount = subCollection.docs.reduce((acc: EmailSubscriber[], subscriberSnap) => {
    const subscriber = subscriberSnap.data() as EmailSubscriber;
    if (subscriber.globalUnsubscribe) {
      acc.concat(subscriber);      
    }
    return acc;
  }, []).length;

  return {dbSubCount, dbUnsubCount};

}

// Also used by the chron job (see verifySubscriberCountMatch)
export const getAllSubCounts = async (): Promise<SubCountData> => {

  const {dbSubCount, dbUnsubCount} = await getDbSubscriberCount();

  const sgSubCount = await getSendgridContactCount();

  const subCountData: SubCountData = {
    databaseSubCount: dbSubCount,
    sendGridSubCount: sgSubCount,
    databaseUnsubCount: dbUnsubCount
  }

  functions.logger.log('Fetched this sub count data', subCountData);

  return subCountData;
}

/////// DEPLOYABLE FUNCTIONS ///////

// A cron job triggers this function
export const getSubscriberCount = functions.https.onCall( async (data, context) => {
  functions.logger.log('Received subscriber count request with this data', data);

  assertUID(context);

  const subCountData = await getAllSubCounts();

  return subCountData;
})
