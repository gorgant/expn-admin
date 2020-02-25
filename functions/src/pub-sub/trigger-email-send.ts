import * as functions from 'firebase-functions';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';
import { sendWelcomeEmail } from '../sendgrid/emails/welcome-email';
import { EmailCategories } from '../../../shared-models/email/email-vars.model';
import { sendSubOptInConfirmationEmail } from '../sendgrid/emails/opt-in-email';
import { sendContactFormConfirmationEmail } from '../sendgrid/emails/contact-form-email';
import { sendPurchaseConfirmationEmail } from '../sendgrid/emails/purchase-confirmation-email';
import { sendWebpageDataLoadFailureEmail } from '../sendgrid/emails/webpage-data-load-failure-email';
import { catchErrors } from '../config/global-helpers';


const executeActions = async (emailData: EmailPubMessage) => {
  
  if (!emailData.emailCategory) {
    console.log('Error, no email category found in pubsub message');
    return new Error('Error, no email category found in pubsub message');
  }

  const emailCategory = emailData.emailCategory;

  switch(emailCategory) {
    case EmailCategories.OPT_IN_CONFIRMATION:
      if (!emailData.subscriber) {
        console.log('No subscriber data in message');
        return new Error('No subscriber data in message');
      }
      return sendSubOptInConfirmationEmail(emailData.subscriber)
        .catch(err => {console.log(`Error sending subOptInConfirmationEmail:`, err); return err;});
    case EmailCategories.WELCOME_EMAIL:
      if (!emailData.subscriber) {
        console.log('No subscriber data in message');
        return new Error('No subscriber data in message');
      }
      return sendWelcomeEmail(emailData.subscriber)
        .catch(err => {console.log(`Error sending welcomeEmail:`, err); return err;});
    case EmailCategories.CONTACT_FORM_CONFIRMATION:
      if (!emailData.contactForm) {
        console.log('Error, no contact form provided, failed to send contact form confirmation')
        return new Error('Error, no contact form provided, failed to send contact form confirmation');
      }
      return sendContactFormConfirmationEmail(emailData.contactForm)
        .catch(err => {console.log(`Error sending welcomeEmail:`, err); return err;});
    case EmailCategories.PURCHASE_CONFIRMATION:
      if (!emailData.order) {
        return new Error('Error, no order provided, failed to send purchase confirmation');
      }
      return sendPurchaseConfirmationEmail(emailData.order)
        .catch(err => {console.log(`Error sending purchaseConfirmationEmail:`, err); return err;});
    case EmailCategories.WEBPAGE_DATA_LOAD_FAILURE:
      if (!emailData.webpageLoadFailureData) {
        return new Error('Error, no webpage load failiure data provided, failed to send webpageDataLoadFailure email;');
      }
      return sendWebpageDataLoadFailureEmail(emailData.webpageLoadFailureData)
        .catch(err => {console.log(`Error sending webpageDataLoadFailure:`, err); return err;});
    default:
    console.log(`Error, no matching email category for ${emailCategory}`);
    return new Error(`Error, no matching email category for ${emailCategory}`);
  }
}


/////// DEPLOYABLE FUNCTIONS ///////


// Listen for pubsub message
export const triggerEmailSend = functions.pubsub.topic(AdminTopicNames.TRIGGER_EMAIL_SEND_TOPIC).onPublish( async (message, context) => {
  const emailData = message.json as EmailPubMessage;
  console.log('Trigger email request received with this data:', emailData);
  console.log('Context from pubsub:', context);

  return catchErrors(executeActions(emailData));

});
