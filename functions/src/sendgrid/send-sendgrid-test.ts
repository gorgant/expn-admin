import * as functions from 'firebase-functions';
import { getSgMail } from './config';
import { catchErrors, assertUID } from '../config/global-helpers';


const sendTestEmail = async (): Promise<any> => {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const sgMail = getSgMail();
  const msg = {
    to: 'test@example.com',
    from: 'test@example.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  await sgMail.send(msg)
    .catch(err => {console.log(`Error sending email: ${msg} because:`, err); return err});
}

/////// DEPLOYABLE FUNCTIONS ///////

export const sendSendgridTest = functions.https.onCall(async (data: any, context) => {
  console.log('Received request to send test email with this data', data);
  assertUID(context);
  
  return catchErrors(sendTestEmail());
});