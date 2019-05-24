import * as functions from 'firebase-functions';
import { adminFirestore } from '../db';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { ContactForm } from '../../../shared-models/user/contact-form.model';
import { AdminFunctionNames } from '../../../shared-models/routes-and-paths/fb-function-names';

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeContactForm = functions.pubsub.topic(AdminFunctionNames.SAVE_CONTACT_FORM_TOPIC).onPublish( async (message, context) => {
  const db = adminFirestore;

  console.log('Context from pubsub', context);
  const contactForm = message.json as ContactForm;
  console.log('Message from pubsub', contactForm);

 
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

  return fbRes && subContactFormFbRes;
})



