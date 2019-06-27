import * as functions from 'firebase-functions';
import { adminFirestore } from '../db';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { ContactForm } from '../../../shared-models/user/contact-form.model';
import { AdminFunctionNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { getSgMail } from '../sendgrid/config';
import { currentEnvironmentType } from '../environments/config';
import { EnvironmentTypes } from '../../../shared-models/environments/env-vars.model';
import { MailData } from '@sendgrid/helpers/classes/mail';

const sendContactFormConfirmationEmail = async (contactForm: ContactForm) => {
  const sgMail = getSgMail();
  const fromEmail = 'hello@myexplearning.com';
  const fromName = 'Explearning';
  const subFirstName = (contactForm.firstName);
  let subEmail: string;
  let bccEmail = undefined;
  const templateId = 'd-c333f6f223d24ba8925e35e08caa37b5';

  // Prevents test emails from going to the actual address used
  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      subEmail = contactForm.email;
      bccEmail = 'greg@myexplearning.com';
      break;
    case EnvironmentTypes.SANDBOX:
      subEmail = 'greg@myexplearning.com';
      break;
    default:
      subEmail = 'greg@myexplearning.com';
      break;
  }

  const msg: MailData = {
    to: {
      email: subEmail,
      name: subFirstName
    },
    from: {
      email: fromEmail,
      name: fromName,
    },
    bcc: bccEmail, // bcc me if this is a real delivery
    templateId,
    dynamicTemplateData: {
      firstName: subFirstName, // Will populate first name greeting if name exists
      contactFormMessage: contactForm.message, // Message sent by the user
    }
  };
  await sgMail.send(msg)
    .catch(err => console.log(`Error sending email: ${msg} because `, err));

  console.log('Email sent', msg);
}

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

  await sendContactFormConfirmationEmail(contactForm)
    .catch(error => console.log('Error sending contact form email', error));

  return fbRes && subContactFormFbRes;
})



