import { sendgridContactsApiUrl, sendgridSecret } from '../sendgrid/config';
import * as request from 'request';
import * as functions from 'firebase-functions';
import { SendgridGetContactCountResponse } from '../../../shared-models/email/sendgrid-job-response.model';
import { submitHttpRequest } from '../config/global-helpers';

/**
 * Query sendgrid API for total contact count
 */
export const getSendgridContactCount = async (): Promise<number> => {

  const requestUrl = `${sendgridContactsApiUrl}/count`;
  const requestOptions: request.Options = {
    method: 'GET',
    url: requestUrl,
    headers: 
      { 
        'content-type': 'application/json',
        authorization: `Bearer ${sendgridSecret}` 
      }
  };

  functions.logger.log('Getting getSendgridContactCount with these options', requestOptions);

  const searchResponse = await submitHttpRequest(requestOptions)
    .catch(err => {functions.logger.log(`Error with Sendgrid contact count request:`, err); throw new functions.https.HttpsError('internal', err);});
  
  const contactCount = (searchResponse as SendgridGetContactCountResponse).contact_count;
  functions.logger.log('Found this many contacts in SG:', contactCount);
  
  return contactCount;

}