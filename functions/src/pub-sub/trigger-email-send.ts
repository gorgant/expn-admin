import * as functions from 'firebase-functions';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';
import { sendWelcomeEmail } from '../sendgrid/emails/welcome-email';
import { EmailCategories } from '../../../shared-models/email/email-vars.model';
import { sendSubOptInConfirmationEmail } from '../sendgrid/emails/opt-in-email';
import { sendContactFormConfirmationEmail } from '../sendgrid/emails/contact-form-email';
import { sendPurchaseConfirmationEmail } from '../sendgrid/emails/purchase-confirmation-email';
import { sendWebpageDataLoadFailureEmail } from '../sendgrid/emails/webpage-data-load-failure-email';

const executeActions = async (emailData: EmailPubMessage) => {
  
  if (!emailData.emailCategory) {
    const errMsg: string = `No email category found in pubsub message`;
    functions.logger.log(errMsg);
    throw new functions.https.HttpsError('internal', errMsg);
  }

  // Terminate email requests to invalid domains
  if (emailData.subscriber?.id.includes('qq.com')) {
    const errMsg: string = `Invalid email domain ${emailData.subscriber.id}. Terminating send request.`;
    functions.logger.log(errMsg);
    throw new functions.https.HttpsError('internal', errMsg);
  }

  const emailCategory = emailData.emailCategory;

  switch(emailCategory) {
    case EmailCategories.OPT_IN_CONFIRMATION:
      if (!emailData.subscriber) {
        const errMsg: string = `No subscriber data in message`
        functions.logger.log(errMsg);
        throw new functions.https.HttpsError('internal', errMsg);
      }
      return sendSubOptInConfirmationEmail(emailData.subscriber);
    case EmailCategories.WELCOME_EMAIL:
      if (!emailData.subscriber) {
        const errMsg: string = `No subscriber data in message`;
        functions.logger.log(errMsg);
        throw new functions.https.HttpsError('internal', errMsg);
      }
      return sendWelcomeEmail(emailData.subscriber);
    case EmailCategories.CONTACT_FORM_CONFIRMATION:
      if (!emailData.contactForm) {
        const errMsg: string = `No contact form provided, failed to send contact form confirmation`
        functions.logger.log(errMsg);
        throw new functions.https.HttpsError('internal', errMsg);
      }
      return sendContactFormConfirmationEmail(emailData.contactForm);
    case EmailCategories.PURCHASE_CONFIRMATION:
      if (!emailData.order) {
        const errMsg: string = `No order provided, failed to send purchase confirmation`;
        functions.logger.log(errMsg);
        throw new functions.https.HttpsError('internal', errMsg);
      }
      return sendPurchaseConfirmationEmail(emailData.order);
    case EmailCategories.WEBPAGE_DATA_LOAD_FAILURE:
      if (!emailData.webpageLoadFailureData) {
        const errMsg: string = `No webpage load failiure data provided, failed to send webpageDataLoadFailure email;`
        functions.logger.log(errMsg);
        throw new functions.https.HttpsError('internal', errMsg);
      }
      return sendWebpageDataLoadFailureEmail(emailData.webpageLoadFailureData);
    default:
      const defaultErrorMsg: string = `No matching email category for ${emailCategory}`;
      functions.logger.log(defaultErrorMsg);
      throw new functions.https.HttpsError('internal', defaultErrorMsg);
  }
}


/////// DEPLOYABLE FUNCTIONS ///////


// Listen for pubsub message
export const triggerEmailSend = functions.pubsub.topic(AdminTopicNames.TRIGGER_EMAIL_SEND_TOPIC).onPublish( async (message, context) => {
  const emailData = message.json as EmailPubMessage;
  functions.logger.log('Trigger email request received with this data:', emailData);
  functions.logger.log('Context from pubsub:', context);

  return executeActions(emailData);

});
