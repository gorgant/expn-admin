import { EmailSubscriber } from "../../../../shared-models/subscribers/email-subscriber.model";

import { getSgMail, EmailWebsiteLinks } from "../config";

import { EmailSenderAddresses, EmailSenderNames, EmailTemplateIds, EmailUnsubscribeGroupIds, EmailCategories, AdminEmailAddresses } from "../../../../shared-models/email/email-vars.model";

import { BillingDetails } from "../../../../shared-models/billing/billing-details.model";

import { currentEnvironmentType } from "../../config/environments-config";

import { EnvironmentTypes } from "../../../../shared-models/environments/env-vars.model";

import { MailData } from "@sendgrid/helpers/classes/mail";
import { adminFirestore } from "../../config/db-config";
import { AdminCollectionPaths } from "../../../../shared-models/routes-and-paths/fb-collection-paths";
import * as functions from 'firebase-functions';

const db = adminFirestore;

const markIntroEmailSent = async (subscriber: EmailSubscriber) => {

  const introEmailSent: Partial<EmailSubscriber> = {
    introEmailSent: true
  }

  const fbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subscriber.id).update(introEmailSent)
    .catch(err => {console.log(`Failed to update subscriber data in admin database`, err); return err;});

  console.log('Marked intro email sent', fbRes);
  return fbRes;
}

export const sendWelcomeEmail = async (subscriber: EmailSubscriber) => {
  console.log('Sending Welcome Email to this subscriber', subscriber.id);

  const sgMail = getSgMail();
  const fromEmail: string = EmailSenderAddresses.EXPLEARNING_NEWSLETTER;
  const fromName: string = EmailSenderNames.EXPLEARNING_NEWSLETTER;
  const toFirstName: string = (subscriber.publicUserData.billingDetails as BillingDetails).firstName;
  let toEmail: string;
  let bccEmail: string;
  const templateId: string = EmailTemplateIds.EXPLEARNING_WELCOME_EMAIL;
  const unsubscribeGroupId: number = EmailUnsubscribeGroupIds.EXPLEARNING_COMMUNICATIONS_STRATEGIES;
  let categories: string[];
  
  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      toEmail = subscriber.id;
      categories = [EmailCategories.WELCOME_EMAIL, EmailCategories.MARKETING_NEWSLETTER];
      bccEmail = AdminEmailAddresses.EXPLEARNING_DEFAULT;
      break;
    case EnvironmentTypes.SANDBOX:
      toEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      categories = [EmailCategories.WELCOME_EMAIL, EmailCategories.MARKETING_NEWSLETTER, EmailCategories.TEST_SEND];
      bccEmail = '';
      break;
    default:
      toEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      categories = [EmailCategories.WELCOME_EMAIL, EmailCategories.MARKETING_NEWSLETTER, EmailCategories.TEST_SEND];
      bccEmail = '';
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
    bcc: bccEmail,
    templateId,
    dynamicTemplateData: {
      firstName: toFirstName, // Will populate first name greeting if name exists
      blogUrl: EmailWebsiteLinks.BLOG_URL,
      remoteCoachUrl: EmailWebsiteLinks.REMOTE_COACH_URL,
      replyEmailAddress: fromEmail
    },
    trackingSettings: {
      subscriptionTracking: {
        enable: true, // Enable tracking in order to catch the unsubscribe webhook
      },
    },
    asm: {
      groupId: unsubscribeGroupId, // Set the unsubscribe group
    },
    categories
  };
  const sendgridResponse = await sgMail.send(msg)
    .catch(err => {console.log(`Error sending email: ${msg} because:`, err); throw new functions.https.HttpsError('internal', err);});
  
  // If email is successful, mark intro email sent
  if (sendgridResponse) {
    await markIntroEmailSent(subscriber);
  }

  console.log('Email sent', msg);
  return sendgridResponse;
}
