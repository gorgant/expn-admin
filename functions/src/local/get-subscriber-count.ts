import * as functions from 'firebase-functions';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { EmailSubscriberKeys } from '../../../shared-models/subscribers/email-subscriber.model';
import { SubCountData } from '../../../shared-models/subscribers/sub-count-data.model';
import { adminFirestore } from '../config/db-config';
import { assertUID } from '../config/global-helpers';
import { getSendgridContactCount } from '../sendgrid/get-sendgrid-sub-count';
import { getSendgridGlobalSuppressionCount } from '../sendgrid/get-sendgrid-global-suppression-count';

const adminDb = adminFirestore;

const getDbSubscriberCount = async () => {

  const subCollectionPath = AdminCollectionPaths.SUBSCRIBERS;
  const subCollection = await adminDb.collection(subCollectionPath)
    .where(`${EmailSubscriberKeys.OPT_IN_CONFIRMED}`, '==', true)
    .get()
    .catch(err => {functions.logger.log(`Error fetching subCollection from admin database:`, err); throw new functions.https.HttpsError('internal', err);});

  const dbSubCount = subCollection.size;

  const unSubCollection = await adminDb.collection(subCollectionPath)
    .where(`${EmailSubscriberKeys.OPT_IN_CONFIRMED}`, '==', false)
    .where(`${EmailSubscriberKeys.OPT_IN_TIMESTAMP}`, '>', 0)
    .get()
    .catch(err => {functions.logger.log(`Error fetching unSubCollection from admin database:`, err); throw new functions.https.HttpsError('internal', err);});

  const dbUnsubCount = unSubCollection.size;
  
  return {dbSubCount, dbUnsubCount};

}

// Also used by the chron job (see verifySubscriberCountMatch)
export const getAllSubCounts = async (): Promise<SubCountData> => {

  const {dbSubCount, dbUnsubCount} = await getDbSubscriberCount();

  const sgSubCount = await getSendgridContactCount();
  const sgSuppressionCount = await getSendgridGlobalSuppressionCount();
  const sgSubCountMinusSuppressions = sgSubCount - sgSuppressionCount;

  const subCountData: SubCountData = {
    databaseSubCount: dbSubCount,
    sendGridSubCount: sgSubCountMinusSuppressions,
    databaseUnsubCount: dbUnsubCount
  }

  functions.logger.log('Fetched this combined sub count data', subCountData);

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
