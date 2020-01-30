import * as functions from 'firebase-functions';
import { getSgMail } from './config';


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
  sgMail.send(msg)
    .catch(error => {
      console.log(error);
      return error;
    });
}

/////// DEPLOYABLE FUNCTIONS ///////

export const sendSendgridTest = functions.https.onCall(async (data: any, context) => {
  console.log('Received request to send test email with this data', data);
  
  const sgRes = await sendTestEmail().catch(error => console.log('Error in send email funciton', error));

  return sgRes;
});