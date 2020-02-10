import * as functions from 'firebase-functions';
import { adminFirestore } from '../db';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { ContactForm } from '../../../shared-models/user/contact-form.model';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { PubSub } from '@google-cloud/pubsub';
import { adminProjectId } from '../environments/config';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';
import { EmailCategories } from '../../../shared-models/email/email-vars.model';

const pubSub = new PubSub();


// Trigger email send
const triggerContactFormConfirmationEmail = async(contactForm: ContactForm) => {
  const topicName = AdminTopicNames.TRIGGER_EMAIL_SEND_TOPIC;
  const emailCategory = EmailCategories.CONTACT_FORM_CONFIRMATION;
  const topic = pubSub.topic(`projects/${adminProjectId}/topics/${topicName}`);
  const pubsubMsg: EmailPubMessage = {
    emailCategory,
    contactForm
  }
  const topicPublishRes = await topic.publishJSON(pubsubMsg)
    .catch(err => {throw new Error(`Publish to topic ${topicName} failed with error: ${err}`)});
  console.log(`Res from ${topicName}: ${topicPublishRes}`);
}


/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeContactForm = functions.pubsub.topic(AdminTopicNames.SAVE_CONTACT_FORM_TOPIC).onPublish( async (message, context) => {
  const db = adminFirestore;

  console.log('Context from pubsub', context);
  const contactForm = message.json as ContactForm;
  console.log('Message from pubsub', contactForm);

 // Store contact form
  const fbRes = await db.collection(AdminCollectionPaths.CONTACT_FORMS).doc(contactForm.id).set(contactForm)
    .catch(error => console.log(error));
    console.log('Contact form stored', fbRes);
  
  // Also update subcriber with contact form data
  const subContactFormFbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(contactForm.email)
    .collection(AdminCollectionPaths.CONTACT_FORMS).doc(contactForm.id)
    .set(contactForm)
    .catch(error => {
      console.log('Error storing subscriber contact form', error)
      return error;
    });
    console.log('Contact form stored', subContactFormFbRes);  

  // Trigger contact form confirmation email
  await triggerContactFormConfirmationEmail(contactForm)
    .catch(error => {throw new Error(`Error publishing contact form topic to admin: ${error}`)});

  return fbRes && subContactFormFbRes;
})



