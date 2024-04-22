import { MessagePublishedData, PubSubOptions, onMessagePublished } from "firebase-functions/v2/pubsub";
import { AdminTopicNames } from "../../../shared-models/routes-and-paths/fb-function-names.model";
import { EnvironmentTypes, ProductionCloudStorage, SandboxCloudStorage, SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";
import { CloudEvent, logger } from "firebase-functions/v2";
import { PublicUserImportMetadata } from "../../../shared-models/user/public-user-import-data.model";
import { currentEnvironmentType } from "../config/environments-config";
import { adminStorage } from "../config/storage-config";
import { basename, join } from 'path';
import { tmpdir } from 'os';
import { AdminCsDirectoryPaths } from "../../../shared-models/routes-and-paths/cs-directory-paths.model";
import { ensureDir, remove } from "fs-extra";
import { HttpsError } from "firebase-functions/v2/https";
import { PublicUserKeys } from "../../../shared-models/user/public-user.model";
import { SubscriberData } from '../../../shared-models/email/subscriber-data.model';
import { EmailOptInSource } from "../../../shared-models/email/email-opt-in-source.model";
import { importPublicUsersToDb } from "./import-public-users-to-db";
import * as Excel from 'exceljs';

const adminBlogStorageBucket = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? 
  adminStorage.bucket(ProductionCloudStorage.EXPN_ADMIN_DATA_IMPORTS_STORAGE_NO_PREFIX) :
  adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_DATA_IMPORTS_STORAGE_NO_PREFIX);

// Exit if file is not an image.
const objectIsValidCheck = (publicUserMetadata: PublicUserImportMetadata): boolean => {
  if (!publicUserMetadata?.customMetadata?.fileExt || !publicUserMetadata.customMetadata.fileExt.includes('xlsx')) {
    logger.log('Object is not an xlsx file.');
    return false;
  }
  return true
}

const loadDocumentIntoTempStorage = async (publicUserMetadata: PublicUserImportMetadata): Promise<[string, string]> => {
  const originalCsvFilePath = publicUserMetadata.customMetadata.filePath;
  const originalCsvFileName = basename(originalCsvFilePath);
  
  const workingDir = join(tmpdir(), AdminCsDirectoryPaths.PUBLIC_USER_IMPORTS);
  const tmpFilePath = join(workingDir, originalCsvFileName);

  // 1. Ensure directory exists
  await ensureDir(workingDir)
    .catch(err => {logger.log(`Error ensuring directory exists:`, err); throw new HttpsError('internal', err);});
    

  // 2. Download Source File
  await adminBlogStorageBucket.file(originalCsvFilePath).download({
    destination: tmpFilePath
  })
    .catch(err => {logger.log(`Error retrieving file at ${originalCsvFilePath}:`, err); throw new HttpsError('internal', err);});
  logger.log('Document downloaded locally to', tmpFilePath);

  return [tmpFilePath, workingDir];
}

// Courtesy of GPT: https://chat.openai.com/share/e/ba03d68c-ef3e-46ff-a808-a8146ce6130a
// Hardcoded column values are pulled from the Explearning Academy database export
// Creates an array of SubscriberData by extracting the Email and First Name from the document and skipping optOuts
const parseDocument = async (tempFilePath: string, workingDir: string) => {
  const publicUsersToImport: SubscriberData[] = [];
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(tempFilePath);

  const worksheet = workbook.getWorksheet(1); // Assumes the data is in the first worksheet
  if (!worksheet) {
    const err = new Error('No worksheet found in the uploaded document');
    logger.error(`Error parsing worksheet:`, err); 
    return;
  }

  let emailColIndex = 0;
  let firstNameColIndex = 0;
  let optedOutColIndex = 0;

  // Read headers to get the column indices
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    if (cell.value === 'Email Address') emailColIndex = colNumber;
    if (cell.value === 'First Name') firstNameColIndex = colNumber;
    if (cell.value === 'Opted out of commercial emails') optedOutColIndex = colNumber;
  });

  if (!emailColIndex || !firstNameColIndex || !optedOutColIndex) {
    logger.error(`Error parsing worksheet: One or more required headers are missing`);
    return;
  }

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber > 1) {  // Skip the header row
      const email = row.getCell(emailColIndex).text;
      const firstName = row.getCell(firstNameColIndex).text;
      const optedOut = row.getCell(optedOutColIndex).text;

      if (optedOut !== 'Yes' && email && firstName) {
        const newUser: SubscriberData = {
          [PublicUserKeys.EMAIL]: email,
          [PublicUserKeys.EMAIL_OPT_IN_SOURCE]: EmailOptInSource.ACADEMY_IMPORT,
          [PublicUserKeys.FIRST_NAME]: firstName,
        };
        publicUsersToImport.push(newUser);
      }
    }
  });

  // Remove the temp document from the filesystem
  await remove(workingDir);

  logger.log(`Document parsed with ${publicUsersToImport.length} publicUsers to import`);
  return publicUsersToImport;
}

const executeActions = async (publicUserImportMetadata: PublicUserImportMetadata) => {
  const [tmpFilePath, workingDir] = await loadDocumentIntoTempStorage(publicUserImportMetadata);
  const publicUsersToImport = await parseDocument(tmpFilePath, workingDir);
  if (publicUsersToImport && publicUsersToImport.length > 0) {
    importPublicUsersToDb(publicUsersToImport);
  }
}


/////// DEPLOYABLE FUNCTIONS ///////
const pubSubOptions: PubSubOptions = {
  topic: AdminTopicNames.PARSE_PUBLIC_USER_IMPORT_DATA_TOPIC,
  secrets: [SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS]
};
// Listen for pubsub message
export const onPubParsePublicUserImportData = onMessagePublished(pubSubOptions, async (event: CloudEvent<MessagePublishedData<PublicUserImportMetadata>>) => {
  const publicUserImportMetadata = event.data.message.json;
  logger.log(`${AdminTopicNames.PARSE_PUBLIC_USER_IMPORT_DATA_TOPIC} requested with this data:`, publicUserImportMetadata);

    // Exit function if invalid object
    if(!objectIsValidCheck(publicUserImportMetadata)) {
      throw new HttpsError('failed-precondition', 'Invalid object detected.');
    };

  await executeActions(publicUserImportMetadata);
});