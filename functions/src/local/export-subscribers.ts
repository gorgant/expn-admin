import * as functions from 'firebase-functions';
import { EnvironmentTypes, ProductionCloudStorage, PRODUCTION_APPS, SandboxCloudStorage, SANDBOX_APPS } from '../../../shared-models/environments/env-vars.model';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { AdminCsDirectoryPaths } from '../../../shared-models/routes-and-paths/cs-directory-paths';
import { EmailSubscriber, EmailSubscriberKeys } from '../../../shared-models/subscribers/email-subscriber.model';

import { ExportSubscribersParams } from '../../../shared-models/subscribers/export-subscriber-params.model';
import { ExportSubscriberData } from '../../../shared-models/subscribers/export-subscriber-data.model';

import { adminFirestore } from '../config/db-config';
import { currentEnvironmentType } from '../config/environments-config';
import { assertUID } from '../config/global-helpers';
import { expnAdminStorage } from '../config/storage-config';

import * as json2csv from 'json2csv';
import * as fs from 'fs-extra';
import { now } from 'moment';
import { join } from 'path';
import { tmpdir } from 'os';

const adminStorage = expnAdminStorage;
const adminDb = adminFirestore;

const reportsBucket = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? 
  adminStorage.bucket(ProductionCloudStorage.EXPN_ADMIN_REPORTS_STORAGE_AF_CF) : 
  adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_REPORTS_STORAGE_AF_CF);

const generateSubCsv = async (exportParams: ExportSubscribersParams): Promise<string> => {
  const subCollectionPath = AdminCollectionPaths.SUBSCRIBERS;
  let subCollection;
  if (exportParams.includeUnconfirmedSubs) {
    functions.logger.log('User chose to include unconfirmed subs');
    subCollection = await adminDb.collection(subCollectionPath)
      .orderBy(`${EmailSubscriberKeys.CREATED_DATE}`, 'desc')
      .where(`${EmailSubscriberKeys.CREATED_DATE}`, '<=', exportParams.endDate)
      .where(`${EmailSubscriberKeys.CREATED_DATE}`, '>=', exportParams.startDate)
      .limit(exportParams.limit)
      .get()
      .catch(err => {functions.logger.log(`Error fetching subscriber collection from admin database:`, err); throw new functions.https.HttpsError('internal', err);});
  } else {
    functions.logger.log('User chose to exclude unconfirmed subs');
    subCollection = await adminDb.collection(subCollectionPath)
      .orderBy(`${EmailSubscriberKeys.CREATED_DATE}`, 'desc')
      .where(`${EmailSubscriberKeys.CREATED_DATE}`, '<=', exportParams.endDate)
      .where(`${EmailSubscriberKeys.CREATED_DATE}`, '>=', exportParams.startDate)
      .where(`${EmailSubscriberKeys.OPT_IN_CONFIRMED}`, '==', true)
      .limit(exportParams.limit)
      .get()
      .catch(err => {functions.logger.log(`Error fetching subscriber collection from admin database:`, err); throw new functions.https.HttpsError('internal', err);});
  }

  if (subCollection.empty) {
    const errMsg = 'No subscribers found with the current filter settings.';
    functions.logger.log(`${errMsg} Terminating function`); 
    throw new functions.https.HttpsError('internal', errMsg);
  }
  
  const transformedSubData: ExportSubscriberData[] = []
  subCollection.forEach(subscriberRef => {
    const subscriber = subscriberRef.data() as EmailSubscriber;

    const subExportData: ExportSubscriberData = {
      id: subscriber.id,
      firstName: subscriber.publicUserData.billingDetails?.firstName ? subscriber.publicUserData.billingDetails.firstName : '',
      createdDate: subscriber.createdDate,
      modifiedDate: subscriber[EmailSubscriberKeys.MODIFIED_DATE],
      lastSubSource: subscriber.lastSubSource.toString(),
      subSources: subscriber.subscriptionSources.join(),
      introEmailSent: subscriber.introEmailSent ? 1 : 0,
      globalUnsubscribe: subscriber.globalUnsubscribe?.unsubscribeDate ? 1 : 0,
      optInConfirmed: subscriber.optInConfirmed ? 1 : 0,
      optInTimestamp: subscriber.optInTimestamp ? subscriber.optInTimestamp : 0,
      sendgridContactId: subscriber.sendgridContactId ? subscriber.sendgridContactId : ''
    }

    transformedSubData.push(subExportData);
  })

  functions.logger.log(`Generating sub CSV with ${transformedSubData.length} subscribers`);

  return json2csv.parse(transformedSubData);

}

const uploadCsvToCloudStorage = async (subCsv: string): Promise<string> => {
  const projectId = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? PRODUCTION_APPS.expnAdminApp.projectId : SANDBOX_APPS.expnAdminApp.projectId;
  const reportId = `sub-export-${projectId}-${now()}`;
  const fileName = `${reportId}.csv`;
  const bucketDirectory = AdminCsDirectoryPaths.SUB_REPORTS;
  const workingDir = join(tmpdir(), bucketDirectory)
  const tempFilePath = join(workingDir, fileName);
  const bucketFilePath = join(bucketDirectory, fileName); // The path of the file in the GS bucket

  await fs.outputFile(tempFilePath, subCsv); // Write csv data to temp storage

  functions.logger.log(`Uploading file to this path: ${bucketFilePath}`);

  await reportsBucket.upload(tempFilePath, {destination: bucketFilePath}) // Upload file to storage
    .catch(err => {functions.logger.log(`Error uploading image data:`, err); throw new functions.https.HttpsError('internal', err);});

  await fs.remove(workingDir); // Remove file from temp memory

  return bucketFilePath;
}

// Courtesy of https://stackoverflow.com/a/42959262/6572208
// Requires the "signBlob" permission in Service Account
const fetchDownloadUrl = async (filePath: string): Promise<string> => {

  const signedResponse = await reportsBucket.file(filePath).getSignedUrl(
    {
      action: 'read',
      expires: '03-09-2491'
    }
  )
    .catch(err => {functions.logger.log(`Error generating download url:`, err); throw new functions.https.HttpsError('internal', err);});

  const downloadUrl = signedResponse[0];

  functions.logger.log('Returning this download url', downloadUrl);

  return downloadUrl;

}

const executeActions = async (exportParams: ExportSubscribersParams) => {

  const subCsv = await generateSubCsv(exportParams);

  const filePath = await uploadCsvToCloudStorage(subCsv);

  const downloadUrl = await fetchDownloadUrl(filePath);

  return downloadUrl;

}



/////// DEPLOYABLE FUNCTIONS ///////

export const exportSubscribers = functions.https.onCall(async (exportParams: ExportSubscribersParams, context) => {
  functions.logger.log('Received export subscribers request with these params', exportParams);

  assertUID(context);

  const subDataDownloadUrl = await executeActions(exportParams);

 
  return subDataDownloadUrl;
});