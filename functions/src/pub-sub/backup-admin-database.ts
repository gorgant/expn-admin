import * as functions from 'firebase-functions';
import { auth } from 'google-auth-library';
import { AdminFunctionNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { adminProjectId, currentEnvironmentType } from '../environments/config';
import { EnvironmentTypes, ProductionCloudStorage, SandboxCloudStorage } from '../../../shared-models/environments/env-vars.model';
import { Bucket } from '@google-cloud/storage';
import { adminStorage } from '../db';
import { now } from 'moment';

let backupBucket: Bucket;

const setBucketsBasedOnEnvironment = (): Bucket => {

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      backupBucket = adminStorage.bucket(ProductionCloudStorage.EXPLEARNING_ADMIN_BACKUP_STORAGE_AF_CF);
      break;
    case EnvironmentTypes.SANDBOX:
      backupBucket = adminStorage.bucket(SandboxCloudStorage.EXPLEARNING_ADMIN_BACKUP_STORAGE_AF_CF);
      break;
    default:
      backupBucket = adminStorage.bucket(SandboxCloudStorage.EXPLEARNING_ADMIN_BACKUP_STORAGE_AF_CF);
      break;
  }

  return backupBucket;
}

// Courtesy of: https://medium.com/@nedavniat/how-to-perform-and-schedule-firestore-backups-with-google-cloud-platform-and-nodejs-be44bbcd64ae

const processBackup = async () => {
  const projectId = adminProjectId;
  const bucket = setBucketsBasedOnEnvironment();
  console.log('Deploying to this bucket name', bucket.name);

  // Must add import/export IAM to default service account
  const admin = await auth.getClient({
    scopes: [                               // scopes required to make a request
        'https://www.googleapis.com/auth/datastore',
    ]
  });

  // Check for api updates: https://firebase.google.com/docs/firestore/reference/rest/v1beta1/projects.databases/exportDocuments
  const url = `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default):exportDocuments`;

  const test = false;

  if (test) {
    console.log('Function test deployed to this url', url);
    return true;
  } else {
    console.log('Function actually deployed to this url', url);
    return admin.request({
      url,
      method: 'POST',
      data: {
        outputUriPrefix: `gs://${bucket.name}/database-backup/${now()}`
      }
    })
  }

}

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const backupAdminDatabase = functions.pubsub.topic(AdminFunctionNames.BACKUP_ADMIN_DATABASE).onPublish(processBackup);