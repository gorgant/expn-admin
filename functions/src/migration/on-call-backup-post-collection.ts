import { logger } from "firebase-functions/v2";
import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { adminFirestore } from "../config/db-config";
import { MigrationCollectionPaths, SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";

const backupCollection = async() => {

  const postsRef = adminFirestore.collection(SharedCollectionPaths.POSTS);
  // const postsRef = adminFirestore.collection('altBackupPosts'); // For testing purposes only
  const backupPostsCollectionRef = adminFirestore.collection(MigrationCollectionPaths.BACKUP_POSTS);
  
  const postCollectionSnapshot = await postsRef.get()
    .catch(err => {logger.log(`Error fetching postCollection:`, err); throw new HttpsError('internal', err);});
  
  let writeBatch = adminFirestore.batch();
  let operationCount = 0;

  for (const doc of postCollectionSnapshot.docs) {
    const backupPostRef = backupPostsCollectionRef.doc(doc.id);
    writeBatch.set(backupPostRef, doc.data());
    
    operationCount++;

    // Firestore batch limit is 500 operations per batch
    if (operationCount === 490) {
      await writeBatch.commit()
        .catch(err => {logger.log(`Error writing batch to backupPostsCollectionRef:`, err); throw new HttpsError('internal', err);});
      writeBatch = adminFirestore.batch();
      logger.log(`Writing ${operationCount} posts to backupPostsCollection`);
      operationCount = 0; // Reset the count to 0
    }
  }

  // Commit any remaining operations in the last batch
  if (operationCount > 0) {
    logger.log(`Writing ${operationCount} posts to backupPostsCollection`);
    await writeBatch.commit()
      .catch(err => {logger.log(`Error writing batch to backupPostsCollectionRef:`, err); throw new HttpsError('internal', err);});
  }

}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true
};

export const onCallBackupPostCollection = onCall(callableOptions, async (request: CallableRequest<void>): Promise<void> => {
  const exportParams = request.data;
  logger.log('onCallBackupPostCollection requested with this data:', exportParams);

  await backupCollection();
});