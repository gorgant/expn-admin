import * as functions from 'firebase-functions';
import { SubCountData } from '../../../shared-models/subscribers/sub-count-data.model';
import { sendSubCountMismatchEmail } from '../sendgrid/emails/sub-count-mismatch-email';
import { currentEnvironmentType } from '../config/environments-config';
import { EnvironmentTypes } from '../../../shared-models/environments/env-vars.model';
import { getAllSubCounts } from '../local/get-subscriber-count';

// Only send mismatch warning if the environment type is production, since sandbox will never match SG records
const verifySubCountMatch = async (subCountData: SubCountData) => {
  if (currentEnvironmentType === EnvironmentTypes.SANDBOX) {
    functions.logger.log(`Sandbox detected, terminating sub count verification`);
    return;
  }
  
  if (subCountData.sendGridSubCount !== subCountData.databaseSubCount) {
    sendSubCountMismatchEmail(subCountData)
      .catch(err => {functions.logger.log(`Error sending sub count mismatch email:`, err)});
    return;
  }

  functions.logger.log(`Sub count match verified with ${subCountData.sendGridSubCount} contacts on Sendgrid and ${subCountData.databaseSubCount} subs in the database.`)
  
}

/////// DEPLOYABLE FUNCTIONS ///////

// A cron job triggers this function
export const verifySubscriberCountMatch = functions.https.onRequest( async (req, res ) => {
  functions.logger.log('Get subscriber count request received with these headers', req.headers);

  if (req.headers['user-agent'] !== 'Google-Cloud-Scheduler') {
    functions.logger.log('Invalid request, ending operation');
    return;
  }

  const subCountData = await getAllSubCounts();
  await verifySubCountMatch(subCountData);

  res.status(200).send();
})
