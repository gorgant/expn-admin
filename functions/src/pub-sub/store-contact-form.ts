import * as functions from 'firebase-functions';
import { adminFirestore } from '../config/db-config';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { ContactForm } from '../../../shared-models/user/contact-form.model';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { PubSub } from '@google-cloud/pubsub';
import { adminProjectId } from '../config/environments-config';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';
import { EmailCategories } from '../../../shared-models/email/email-vars.model';

const pubSub = new PubSub();


// Trigger email send
const triggerContactFormConfirmationEmail = async(contactForm: ContactForm) => {
  const topicName = AdminTopicNames.TRIGGER_EMAIL_SEND_TOPIC;
  const projectId = adminProjectId;
  const emailCategory = EmailCategories.CONTACT_FORM_CONFIRMATION;
  const topic = pubSub.topic(`projects/${projectId}/topics/${topicName}`);
  const pubsubMsg: EmailPubMessage = {
    emailCategory,
    contactForm
  }
  const topicPublishRes = await topic.publishJSON(pubsubMsg)
    .catch(err => {functions.logger.log(`Failed to publish to topic "${topicName}" on project "${projectId}":`, err); throw new functions.https.HttpsError('internal', err);});;
  functions.logger.log(`Publish to topic "${topicName}" on project "${projectId}" succeeded:`, topicPublishRes);
}

const executeActions = async (contactForm: ContactForm) => {
  const db = adminFirestore;

  // Store contact form
  const contactFormFbRes = await db.collection(AdminCollectionPaths.CONTACT_FORMS).doc(contactForm.id).set(contactForm)
     .catch(err => {functions.logger.log(`Failed to store contact form in admin database`, err); throw new functions.https.HttpsError('internal', err);});;
     
  functions.logger.log('Contact form stored in admin database:', contactFormFbRes);
   
  // Also update subcriber with contact form data
  const subContactFormFbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(contactForm.email)
    .collection(AdminCollectionPaths.CONTACT_FORMS).doc(contactForm.id)
    .set(contactForm)
    .catch(err => {functions.logger.log(`Failed to update subscriber contact form in admin database`, err); throw new functions.https.HttpsError('internal', err);});;
  functions.logger.log('Subscriber updated with contact form:', subContactFormFbRes); 
 
  // Trigger contact form confirmation email
  await triggerContactFormConfirmationEmail(contactForm);
}


/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeContactForm = functions.pubsub.topic(AdminTopicNames.SAVE_CONTACT_FORM_TOPIC).onPublish( async (message, context) => {
  const contactForm = message.json as ContactForm;
  functions.logger.log('Store contact form request received with this data:', contactForm);
  functions.logger.log('Context from pubsub:', context);
  
  return executeActions(contactForm);
});



