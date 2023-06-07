import { sendgridSecret, sendgridSuppressionsApiUrl } from './config';
import * as request from 'request';
import * as functions from 'firebase-functions';
import { SendgridGlobalSuppressionObject } from '../../../shared-models/email/sendgrid-job-response.model';
import { submitHttpRequest } from '../config/global-helpers';

/**
 * Query sendgrid API for global suppression count
 */
export const getSendgridGlobalSuppressionCount = async (): Promise<number> => {

  const requestUrl = `${sendgridSuppressionsApiUrl}/unsubscribes`;
  const requestOptions: request.Options = {
    method: 'GET',
    url: requestUrl,
    headers: 
      { 
        'content-type': 'application/json',
        authorization: `Bearer ${sendgridSecret}` 
      }
  };

  functions.logger.log('Getting getSendgridGlobalSuppressions with these options', requestOptions);

  const searchResponse = await submitHttpRequest(requestOptions)
    .catch(err => {functions.logger.log(`Error with getSendgridGlobalSuppressions request:`, err); throw new functions.https.HttpsError('internal', err);});
  
  const globalSupressions = (searchResponse as SendgridGlobalSuppressionObject[]);
  functions.logger.log('Found this many global suppressions in SG:', globalSupressions.length);
  
  return globalSupressions.length;

}