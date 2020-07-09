import { ContactForm } from "../../../../shared-models/user/contact-form.model";
import { getSgMail, EmailWebsiteLinks } from "../config";
import { EmailSenderAddresses, EmailSenderNames, EmailTemplateIds, EmailCategories, AdminEmailAddresses } from "../../../../shared-models/email/email-vars.model";
import { currentEnvironmentType } from "../../config/environments-config";
import { EnvironmentTypes } from "../../../../shared-models/environments/env-vars.model";
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import * as functions from 'firebase-functions';


export const sendContactFormConfirmationEmail = async (contactForm: ContactForm) => {

  functions.logger.log('Sending Contact Form Confirmation Email to this subscriber', contactForm.email);

  const sgMail = getSgMail();
  const fromEmail = EmailSenderAddresses.EXPLEARNING_DEFAULT;
  const fromName = EmailSenderNames.EXPLEARNING_DEFAULT;
  const toFirstName = (contactForm.firstName);
  let toEmail: string;
  let bccEmail: string;
  const templateId = EmailTemplateIds.EXPLEARNING_CONTACT_FORM_CONFIRMATION;
  let categories: string[];

  // Prevents test emails from going to the actual address used
  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      toEmail = contactForm.email;
      categories = [EmailCategories.CONTACT_FORM_CONFIRMATION];
      bccEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      break;
    case EnvironmentTypes.SANDBOX:
      toEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      categories = [EmailCategories.CONTACT_FORM_CONFIRMATION, EmailCategories.TEST_SEND];
      bccEmail = '';
      break;
    default:
      toEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      categories = [EmailCategories.CONTACT_FORM_CONFIRMATION, EmailCategories.TEST_SEND];
      bccEmail = '';
      break;
  }

  const msg: MailDataRequired = {
    to: {
      email: toEmail,
      name: toFirstName
    },
    from: {
      email: fromEmail,
      name: fromName,
    },
    bcc: bccEmail,
    templateId,
    dynamicTemplateData: {
      firstName: toFirstName, // Will populate first name greeting if name exists
      contactFormMessage: contactForm.message, // Message sent by the user,
      blogUrl: EmailWebsiteLinks.BLOG_URL,
      remoteCoachUrl: EmailWebsiteLinks.REMOTE_COACH_URL,
      replyEmailAddress: fromEmail
    },
    categories
  };
  await sgMail.send(msg)
    .catch(err => {functions.logger.log(`Error sending email: ${msg} because:`, err); throw new functions.https.HttpsError('internal', err);});

  functions.logger.log('Email sent', msg);
}