const firestore = require('@google-cloud/firestore');
import { Bucket } from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import { now } from 'moment';
import { EnvironmentTypes, ProductionCloudStorage, SandboxCloudStorage } from '../../../shared-models/environments/env-vars.model';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { adminProjectId, currentEnvironmentType } from '../config/environments-config';
import { expnAdminStorage } from '../config/storage-config';

const client = new firestore.v1.FirestoreAdminClient();
const adminStorage = expnAdminStorage;

let backupBucket: Bucket;

const setBucketsBasedOnEnvironment = (): Bucket => {

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      backupBucket = adminStorage.bucket(ProductionCloudStorage.EXPN_ADMIN_BACKUP_STORAGE_AF_CF);
      break;
    case EnvironmentTypes.SANDBOX:
      backupBucket = adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_BACKUP_STORAGE_AF_CF);
      break;
    default:
      backupBucket = adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_BACKUP_STORAGE_AF_CF);
      break;
  }

  return backupBucket;
}

// Courtesy of https://cloud.google.com/firestore/docs/solutions/schedule-export#firebase-console
export const processBackup = async () => {

  const bucket = setBucketsBasedOnEnvironment();
  const projectId = adminProjectId;

  functions.logger.log(`Deploying backup data to this bucket: ${bucket.name} and this projectID ${projectId}`);

  const databaseName = client.databasePath(
    projectId,
    '(default)'
  );

  const sendExportRequest = await client.exportDocuments({
      name: databaseName,
      outputUriPrefix: `gs://${bucket.name}/database-backup/${now()}`, // Add gs prefix manually here bc CF bucket config above requires without
      // Leave collectionIds empty to export all collections
      // or define a list of collection IDs:
      // collectionIds: ['users', 'posts']
      collectionIds: [],
    })
    .catch((err: any) => {functions.logger.log(`Error submitting backup request:`, err); throw new functions.https.HttpsError('internal', err);});
  
  const response = sendExportRequest[0];
  
  functions.logger.log(`Operation Complete: ${response['name']}`);

  return response;
};


/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const backupAdminDatabase = functions.pubsub.topic(AdminTopicNames.BACKUP_ADMIN_DATABASE_TOPIC).onPublish( (message, context) => {
  return processBackup();
});