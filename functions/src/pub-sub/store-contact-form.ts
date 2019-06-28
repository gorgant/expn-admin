import * as functions from 'firebase-functions';
import { adminFirestore } from '../db';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { ContactForm } from '../../../shared-models/user/contact-form.model';
import { AdminFunctionNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { getSgMail } from '../sendgrid/config';
import { currentEnvironmentType } from '../environments/config';
import { EnvironmentTypes } from '../../../shared-models/environments/env-vars.model';
import { MailData } from '@sendgrid/helpers/classes/mail';
import { EmailTemplateIds, EmailSenderAddresses, EmailSenderNames, EmailBccAddresses, EmailCategories } from '../../../shared-models/email/email-vars.model';

const sendContactFormConfirmationEmail = async (contactForm: ContactForm) => {
  const sgMail = getSgMail();
  const fromEmail = EmailSenderAddresses.DEFAULT;
  const fromName = EmailSenderNames.DEFAULT;
  const toFirstName = (contactForm.firstName);
  let toEmail: string;
  let bccEmail = undefined;
  const templateId = EmailTemplateIds.CONTACT_FORM_CONFIRMATION;

  // Prevents test emails from going to the actual address used
  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      toEmail = contactForm.email;
      bccEmail = EmailBccAddresses.GREG_ONLY;
      break;
    case EnvironmentTypes.SANDBOX:
      toEmail = EmailBccAddresses.GREG_ONLY;
      break;
    default:
      toEmail = EmailBccAddresses.GREG_ONLY;
      break;
  }

  const msg: MailData = {
    to: {
      email: toEmail,
      name: toFirstName
    },
    from: {
      email: fromEmail,
      name: fromName,
    },
    bcc: bccEmail, // bcc me if this is a real delivery
    templateId,
    dynamicTemplateData: {
      firstName: toFirstName, // Will populate first name greeting if name exists
      contactFormMessage: contactForm.message, // Message sent by the user
    },
    category: EmailCategories.CONTACT_FORM_CONFIRMATION
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



