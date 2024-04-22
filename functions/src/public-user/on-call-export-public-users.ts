import { logger } from "firebase-functions/v2";
import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { PublicUserExportData, PublicUserExportRequestParams, PublicUserExportRequestParamsKeys } from "../../../shared-models/user/public-user-exports.model";
import { adminStorage } from "../config/storage-config";
import { currentEnvironmentType } from "../config/environments-config";
import { EnvironmentTypes, PRODUCTION_APPS, ProductionCloudStorage, SANDBOX_APPS, SandboxCloudStorage, SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";
import { PublicCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { getPublicFirestoreWithAdminCreds } from "../config/db-config";
import { PublicUser, PublicUserKeys } from "../../../shared-models/user/public-user.model";
import { Timestamp } from '@google-cloud/firestore';
import { join } from 'path';
import { tmpdir } from 'os';
import { AdminCsDirectoryPaths } from "../../../shared-models/routes-and-paths/cs-directory-paths.model";
import { AsyncParser } from '@json2csv/node';
import * as fs from 'fs-extra';
import { DateTime } from "luxon";
import { convertMillisToTimestamp } from "../config/global-helpers";

const reportsBucket = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? 
  adminStorage.bucket(ProductionCloudStorage.EXPN_ADMIN_REPORTS_STORAGE_NO_PREFIX) : 
  adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_REPORTS_STORAGE_NO_PREFIX);

const generateSubCsv = async (exportParams: PublicUserExportRequestParams): Promise<string | null> => {
  const publicFirestoreWithAdminCreds = getPublicFirestoreWithAdminCreds();
  
  const publicUserCollectionPath = PublicCollectionPaths.PUBLIC_USERS;
  let publicUserCollection;

  // Only export verified publicUsers (client optionally includes optOuts)
  if (exportParams[PublicUserExportRequestParamsKeys.INCLUDE_OPT_OUTS]) {
    logger.log('Fetching publicUsers including optOuts');
    publicUserCollection = await publicFirestoreWithAdminCreds.collection(publicUserCollectionPath)
      .orderBy(`${PublicUserKeys.CREATED_TIMESTAMP}`, 'desc')
      .where(`${PublicUserKeys.CREATED_TIMESTAMP}`, '<=', convertMillisToTimestamp(exportParams[PublicUserExportRequestParamsKeys.END_DATE]))
      .where(`${PublicUserKeys.CREATED_TIMESTAMP}`, '>=', convertMillisToTimestamp(exportParams[PublicUserExportRequestParamsKeys.START_DATE]))
      .where(`${PublicUserKeys.EMAIL_VERIFIED}`, '==', true)
      .limit(exportParams[PublicUserExportRequestParamsKeys.LIMIT])
      .get()
      .catch(err => {logger.log(`Error fetching publicUser collection from public database:`, err); throw new HttpsError('internal', err);});
  } else {
    logger.log('Fetching publicUsers excluding optOuts');
    publicUserCollection = await publicFirestoreWithAdminCreds.collection(publicUserCollectionPath)
      .orderBy(`${PublicUserKeys.CREATED_TIMESTAMP}`, 'desc')
      .where(`${PublicUserKeys.CREATED_TIMESTAMP}`, '<=', convertMillisToTimestamp(exportParams[PublicUserExportRequestParamsKeys.END_DATE]))
      .where(`${PublicUserKeys.CREATED_TIMESTAMP}`, '>=', convertMillisToTimestamp(exportParams[PublicUserExportRequestParamsKeys.START_DATE]))
      .where(`${PublicUserKeys.EMAIL_OPT_IN_CONFIRMED}`, '==', true)
      .where(`${PublicUserKeys.EMAIL_VERIFIED}`, '==', true)
      .limit(exportParams[PublicUserExportRequestParamsKeys.LIMIT])
      .get()
      .catch(err => {logger.log(`Error fetching publicUser collection from public database:`, err); throw new HttpsError('internal', err);});
  }

  if (publicUserCollection.empty) {
    const errMsg = 'No publicUsers found with the current filter settings.';
    logger.log(`${errMsg} Terminating function`); 
    return null;
  }
  
  const transformedUserData: PublicUserExportData[] = []
  publicUserCollection.forEach(subscriberRef => {
    const publicUser = subscriberRef.data() as PublicUser;
    const publicUserExportData: PublicUserExportData = {
      [PublicUserKeys.CREATED_TIMESTAMP]: publicUser[PublicUserKeys.CREATED_TIMESTAMP] ? (publicUser[PublicUserKeys.CREATED_TIMESTAMP] as Timestamp).toMillis() : 0,
      [PublicUserKeys.EMAIL]: publicUser[PublicUserKeys.EMAIL], 
      [PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE]: publicUser[PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE] ? 1 : 0 as any,
      [PublicUserKeys.EMAIL_OPT_IN_SOURCE]: publicUser[PublicUserKeys.EMAIL_OPT_IN_SOURCE]?.toString() as any,
      [PublicUserKeys.EMAIL_OPT_IN_CONFIRMED]: publicUser[PublicUserKeys.EMAIL_OPT_IN_CONFIRMED] ? 1 : 0 as any,
      [PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP]: publicUser[PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP] ? (publicUser[PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP] as Timestamp).toMillis() : 0, 
      [PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP]: publicUser[PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP] ? (publicUser[PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP] as Timestamp).toMillis() : 0,
      [PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID]: publicUser[PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID],
      [PublicUserKeys.EMAIL_VERIFIED]: publicUser[PublicUserKeys.EMAIL_VERIFIED] ? 1 : 0 as any,
      [PublicUserKeys.FIRST_NAME]: publicUser[PublicUserKeys.FIRST_NAME],
      [PublicUserKeys.ID]: publicUser[PublicUserKeys.ID],
      [PublicUserKeys.LAST_MODIFIED_TIMESTAMP]: publicUser[PublicUserKeys.LAST_MODIFIED_TIMESTAMP] ? (publicUser[PublicUserKeys.LAST_MODIFIED_TIMESTAMP] as Timestamp).toMillis() : 0,
      [PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT]: publicUser[PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT] ? 1 : 0 as any,
    }
    transformedUserData.push(publicUserExportData);
  });

  logger.log(`Generating sub CSV with ${transformedUserData.length} publicUsers`);
  const parser = new AsyncParser();
  const parsedCSV = await parser.parse(transformedUserData).promise();

  return parsedCSV;

}

const uploadCsvToCloudStorage = async (subCsv: string): Promise<string> => {
  const projectId = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? PRODUCTION_APPS.expnAdminApp.projectId : SANDBOX_APPS.expnAdminApp.projectId;
  const reportId = `sub-export-${projectId}-${Timestamp.now().toMillis()}`;
  const fileName = `${reportId}.csv`;
  const bucketDirectory = AdminCsDirectoryPaths.SUB_REPORTS;
  const workingDir = join(tmpdir(), bucketDirectory)
  const tempFilePath = join(workingDir, fileName);
  const bucketFilePath = join(bucketDirectory, fileName); // The path of the file in the GS bucket

  await fs.outputFile(tempFilePath, subCsv); // Write csv data to temp storage

  logger.log(`Uploading file to this path: ${bucketFilePath}`);

  await reportsBucket.upload(tempFilePath, {destination: bucketFilePath}) // Upload file to storage
    .catch(err => {logger.log(`Error uploading image data:`, err); throw new HttpsError('internal', err);});

  await fs.remove(workingDir); // Remove file from temp memory

  return bucketFilePath;
}

// Courtesy of https://stackoverflow.com/a/42959262/6572208
// Requires the "signBlob" permission in Service Account (@developer.gserviceaccount.com for Gen2 functions, @appspot.gserviceaccount.com for Gen1 functions)
const fetchDownloadUrl = async (filePath: string): Promise<string> => {

  const signedResponse = await reportsBucket.file(filePath).getSignedUrl(
    {
      action: 'read',
      expires: DateTime.now().plus(3 * 24 * 60 * 60 * 1000).toJSDate() // Expires three days from now
    }
  )
    .catch(err => {logger.log(`Error generating download url:`, err); throw new HttpsError('internal', err);});

  const downloadUrl = signedResponse[0];

  logger.log('Returning this download url to publicUser report', downloadUrl);

  return downloadUrl;

}

const executeActions = async (exportParams: PublicUserExportRequestParams) => {

  const subCsv = await generateSubCsv(exportParams);

  if (!subCsv) {
    return null;
  }

  const filePath = await uploadCsvToCloudStorage(subCsv);

  const downloadUrl = await fetchDownloadUrl(filePath);

  return downloadUrl;

}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true,
  secrets: [SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS]
};

export const onCallExportPublicUsers = onCall(callableOptions, async (request: CallableRequest<PublicUserExportRequestParams>): Promise<string | null> => {
  const exportParams = request.data;
  logger.log('onCallExportPublicUsers requested with this data:', exportParams);

  const downloadUrl = await executeActions(exportParams);
 
  return downloadUrl;
});