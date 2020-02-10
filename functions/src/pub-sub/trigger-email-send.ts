import * as functions from 'firebase-functions';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';
import { sendWelcomeEmail } from '../sendgrid/emails/welcome-email';
import { EmailCategories } from '../../../shared-models/email/email-vars.model';
import { sendSubOptInConfirmationEmail } from '../sendgrid/emails/opt-in-email';
import { sendContactFormConfirmationEmail } from '../sendgrid/emails/contact-form-email';
import { sendPurchaseConfirmationEmail } from '../sendgrid/emails/purchase-confirmation-email';


/////// DEPLOYABLE FUNCTIONS ///////


// Listen for pubsub message
export const triggerEmailSend = functions.pubsub.topic(AdminTopicNames.TRIGGER_EMAIL_SEND_TOPIC).onPublish( async (message, context) => {

  console.log('Recieved triggerEmailSend request with this context', context);
  const emailData = message.json as EmailPubMessage;
  console.log('Message from pubsub', emailData);
  
  if (!emailData.emailCategory) {
    throw new Error('Error, no email category found in pubsub message');
  }

  const emailCategory = emailData.emailCategory;

  switch(emailCategory) {
    case EmailCategories.OPT_IN_CONFIRMATION:
      if (!emailData.subscriber) {
        throw new Error('No subscriber data in message');
      }
      await sendSubOptInConfirmationEmail(emailData.subscriber)
        .catch(error => {throw new Error(`Error sending subOptInConfirmationEmail: ${error}`)});
      return;
    case EmailCategories.WELCOME_EMAIL:
      if (!emailData.subscriber) {
        throw new Error('No subscriber data in message');
      }
      await sendWelcomeEmail(emailData.subscriber)
        .catch(error => {throw new Error(`Error sending welcomeEmail: ${error}`)});
      return;
    case EmailCategories.CONTACT_FORM_CONFIRMATION:
      if (!emailData.contactForm) {
        throw new Error('Error, no contact form provided, failed to send contact form confirmation');
      }
      await sendContactFormConfirmationEmail(emailData.contactForm)
        .catch(error => {throw new Error(`Error sending welcomeEmail: ${error}`)});
      return;
    case EmailCategories.PURCHASE_CONFIRMATION:
      if (!emailData.order) {
        throw new Error('Error, no order provided, failed to send purchase confirmation');
      }
      await sendPurchaseConfirmationEmail(emailData.order)
        .catch(error => {throw new Error(`Error sending purchaseConfirmationEmail: ${error}`)});
      return;
    default:
      throw new Error(`Error, no matching email category for ${emailCategory}`);
  }


});
