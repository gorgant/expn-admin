import { logger } from "firebase-functions/v2";
import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { adminFirestore } from "../config/db-config";
import { MigrationCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { OldEmailSubscriberKeys } from "../../../shared-models/user/public-user.model";

const backupCollection = async() => {

  // Only back up confirmed subscribers
  const oldEmailSubscribersCollectionRef = adminFirestore.collection(MigrationCollectionPaths.SUBSCRIBERS)
    .where(`${OldEmailSubscriberKeys.OPT_IN_CONFIRMED}`, '==', true);
  
  const backupEmailSubscribersCollectionRef = adminFirestore.collection(MigrationCollectionPaths.BACKUP_SUBSCRIBERS);
  
  const oldEmailSubscriberCollectionSnapshot = await oldEmailSubscribersCollectionRef.get()
    .catch(err => {logger.log(`Error fetching oldEmailSubscriberCollection:`, err); throw new HttpsError('internal', err);});
  let writeBatch = adminFirestore.batch();
  let operationCount = 0;

  for (const doc of oldEmailSubscriberCollectionSnapshot.docs) {
    const backupEmailSubscriberRef = backupEmailSubscribersCollectionRef.doc(doc.id);
    writeBatch.set(backupEmailSubscriberRef, doc.data());
    
    operationCount++;

    // Firestore batch limit is 500 operations per batch
    if (operationCount === 490) {
      await writeBatch.commit()
        .catch(err => {logger.log(`Error writing batch to backupEmailSubscribersCollectionRef:`, err); throw new HttpsError('internal', err);});
      writeBatch = adminFirestore.batch();
      logger.log(`Writing ${operationCount} subscribers to backupEmailSubscribersCollection`);
      operationCount = 0; // Reset the count to 0
    }
  }

  // Commit any remaining operations in the last batch
  if (operationCount > 0) {
    logger.log(`Writing ${operationCount} subscribers to backupEmailSubscribersCollection`);
    await writeBatch.commit()
      .catch(err => {logger.log(`Error writing batch to backupEmailSubscribersCollectionRef:`, err); throw new HttpsError('internal', err);});
  }
}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true
};

export const onCallBackupPublicUserCollection = onCall(callableOptions, async (request: CallableRequest<void>): Promise<void> => {
  const exportParams = request.data;
  logger.log('onCallBackupPublicUserCollection requested with this data:', exportParams);

  await backupCollection();
});