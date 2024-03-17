import { HttpsError, HttpsOptions, onRequest } from "firebase-functions/v2/https";
import { validateRequestToken } from "../config/global-helpers";
import { currentEnvironmentType } from "../config/environments-config";
import { EnvironmentTypes, ProductionCloudStorage, SandboxCloudStorage, SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";
import { adminStorage } from "../config/storage-config";
import { AdminCsDirectoryPaths } from "../../../shared-models/routes-and-paths/cs-directory-paths.model";
import { logger } from "firebase-functions/v2";
import { DateTime } from "luxon";
import { PublicUserExportVars } from "../../../shared-models/user/public-user-exports.model";
import { cloudSchedulerServiceAccountSecret } from "../config/api-key-config";

// Courtesy of https://cloud.google.com/storage/docs/listing-objects#code-samples
const purgeReports = async () => {

  // Selection environment specific bucket
  const reportsBucket = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? 
    adminStorage.bucket(ProductionCloudStorage.EXPN_ADMIN_REPORTS_STORAGE_NO_PREFIX) : 
    adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_REPORTS_STORAGE_NO_PREFIX);

  // Set subdirectory
  const subDirectory = AdminCsDirectoryPaths.SUB_REPORTS;
  const options = {
    prefix: subDirectory,
  };

  // Get array of files, this array destructuring syntax takes the first element [0] of the response, see https://www.freecodecamp.org/news/array-destructuring-in-es6-30e398f21d10/
  const [reportFiles] = await reportsBucket.getFiles(options)
    .catch(err => {logger.log(`Error getting file list from cloud storage:`, err); throw new HttpsError('internal', err);});

  // Exit function if no files found
  if (reportFiles.length < 1) {
    logger.log('No sub reports found, exiting function');
    return;
  }

  logger.log(`Found ${reportFiles.length} sub reports`);

  // Loop through files and check/delete expired reports, use a map instead of forEach to ensure completion before closing function
  const deleteReports = reportFiles.map(async file => {
    const [fileMetadata] = await file.getMetadata()
      .catch(err => {logger.log(`Error getting file metadata:`, err); throw new HttpsError('internal', err);});

    // Check if report has expired, if so, delete
    const lastUpdated = fileMetadata['updated']; // https://cloud.google.com/storage/docs/json_api/v1/objects a string formatted as RFC 3339
    if (!lastUpdated) {
      return;
    }
    const lastUpdatedInMs = DateTime.fromISO(lastUpdated).toMillis();
    const timeSinceLastUpdate = DateTime.now().toMillis() - lastUpdatedInMs;
    const reportExpired = timeSinceLastUpdate > PublicUserExportVars.SUB_REPORT_EXPIRATION;
    if (reportExpired) {
      await file.delete()
        .catch(err => {logger.log(`Error deleting file:`, err); throw new HttpsError('internal', err);});
      logger.log(`Deleted file ${file.name}`);
    }
  })

  await Promise.all(deleteReports);

}

/////// DEPLOYABLE FUNCTIONS ///////

const httpOptions: HttpsOptions = {
  secrets: [
    SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS,
    SecretsManagerKeyNames.CLOUD_SCHEDULER_SERVICE_ACCOUNT_EMAIL,
  ]
};

export const onReqPurgeExpiredPublicUserReports = onRequest(httpOptions, async (req, res) => {

  logger.log('onReqPurgeExpiredPublicUserReports detected with these headers', req.headers);

  const expectedAudience = cloudSchedulerServiceAccountSecret.value();
  
  const isValid = await validateRequestToken(req, res, expectedAudience);
  
  if (!isValid) {
    logger.log('Request verification failed, terminating function');
    return;
  }

  await purgeReports();

  res.status(200).send('onReqPurgeExpiredPublicUserReports succeeded!');

});