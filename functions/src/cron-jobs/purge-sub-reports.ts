import * as functions from 'firebase-functions';
import { expnAdminStorage } from '../config/storage-config';
import * as moment from 'moment';
import { currentEnvironmentType } from '../config/environments-config';
import { EnvironmentTypes, ProductionCloudStorage, SandboxCloudStorage } from '../../../shared-models/environments/env-vars.model';
import { AdminCsDirectoryPaths } from '../../../shared-models/routes-and-paths/cs-directory-paths';
import { SubscriberReportVars } from '../../../shared-models/subscribers/subscriber-report-vars';

const adminStorage = expnAdminStorage;

// Courtesy of https://cloud.google.com/storage/docs/listing-objects#code-samples
const purgeReports = async () => {

  // Selection environment specific bucket
  const reportsBucket = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? 
    adminStorage.bucket(ProductionCloudStorage.EXPN_ADMIN_REPORTS_STORAGE_AF_CF) : 
    adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_REPORTS_STORAGE_AF_CF);

  // Set subdirectory
  const subDirectory = AdminCsDirectoryPaths.SUB_REPORTS;
  const options = {
    prefix: subDirectory,
  };

  // Get array of files, this array destructuring syntax takes the first element [0] of the response, see https://www.freecodecamp.org/news/array-destructuring-in-es6-30e398f21d10/
  const [reportFiles] = await reportsBucket.getFiles(options)
    .catch(err => {functions.logger.log(`Error getting file list from cloud storage:`, err); throw new functions.https.HttpsError('internal', err);});

  // Exit function if no files found
  if (reportFiles.length < 1) {
    functions.logger.log('No sub reports found, exiting function');
    return;
  }

  functions.logger.log(`Found ${reportFiles.length} sub reports`);

  // Loop through files and check/delete expired reports, use a map instead of forEach to ensure completion before closing function
  const deleteReports = reportFiles.map(async file => {
    const [fileMetadata] = await file.getMetadata()
      .catch(err => {functions.logger.log(`Error getting file metadata:`, err); throw new functions.https.HttpsError('internal', err);});

    // Check if report has expired, if so, delete
    const lastUpdated = fileMetadata['updated']; // https://cloud.google.com/storage/docs/json_api/v1/objects
    const lastUpdatedInMs = moment(lastUpdated).valueOf();
    const timeSinceLastUpdate = moment.now() - lastUpdatedInMs;
    const reportExpired = timeSinceLastUpdate > SubscriberReportVars.SUB_REPORT_EXPIRATION;
    if (reportExpired) {
      await file.delete()
        .catch(err => {functions.logger.log(`Error deleting file:`, err); throw new functions.https.HttpsError('internal', err);});
      functions.logger.log(`Deleted file ${file.name}`);
    }
  })

  await Promise.all(deleteReports);

}

/////// DEPLOYABLE FUNCTIONS ///////

// A cron job triggers this function
export const purgeSubReports = functions.https.onRequest( async (req, res ) => {
  functions.logger.log('Purge sub reports request received with these headers', req.headers);

  if (req.headers['user-agent'] !== 'Google-Cloud-Scheduler') {
    functions.logger.log('Invalid request, ending operation');
    return;
  }

  await purgeReports();

  functions.logger.log('All expired sub reports purged', res);
  res.status(200).send('All expired sub reports purged');
})

