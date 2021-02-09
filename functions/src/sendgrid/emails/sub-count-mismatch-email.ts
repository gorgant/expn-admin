import { getSgMail } from "../config";
import { EmailSenderAddresses, EmailSenderNames, EmailCategories, AdminEmailAddresses } from "../../../../shared-models/email/email-vars.model";
import { currentEnvironmentType } from "../../config/environments-config";
import { EnvironmentTypes } from "../../../../shared-models/environments/env-vars.model";
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import * as functions from 'firebase-functions';
import { SubCountData } from "../../../../shared-models/subscribers/sub-count-data.model";


export const sendSubCountMismatchEmail = async (subCountData: SubCountData ) => {
  
  functions.logger.log('Sending Subscriber Count Mismatch Email to admin');
  
  const sgMail = getSgMail();
  const fromEmail: string = EmailSenderAddresses.EXPN_ADMIN;
  const fromName: string = EmailSenderNames.EXPN_ADMIN;
  const toFirstName: string = 'Administrator';
  let toEmail: string;
  const subject: string = '[Automated Error Service] Subscriber Count Mismatch';
  let categories: string[];
  const emailString: string = `Administrators, There is a mismatch between subscribers on Sendgrid and the app database. Sendgrid Count: ${subCountData.sendGridSubCount}. Database Count: ${subCountData.databaseSubCount}. Database Unsub Count: ${subCountData.databaseUnsubCount}. To fix the issue, consider exporting both databases and reconciling the difference.`
  const emailHtml: string = `<p>Administrators,</p>\
    <p>There is a mismatch between subscribers on Sendgrid and the app database:</p>\
    <ul>\
      <li>Sendgrid Count: ${subCountData.sendGridSubCount}</li>\
      <li>Database Count: ${subCountData.databaseSubCount}</li>\
      <li>Database Unsub Count: ${subCountData.databaseUnsubCount}</li>\
    </ul>\
    <p>To fix the issue, consider exporting both databases and reconciling the difference.</p>\
    <p>Good luck!</p>\
    <p>Automated Error Service</p>\
    `
  
  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      toEmail = AdminEmailAddresses.EXPN_GREG_ONLY;
      categories = [EmailCategories.SUBSCRIBER_COUNT_MISMATCH];
      break;
    case EnvironmentTypes.SANDBOX:
      toEmail = AdminEmailAddresses.EXPN_GREG_ONLY;
      categories = [EmailCategories.SUBSCRIBER_COUNT_MISMATCH, EmailCategories.TEST_SEND];
      break;
    default:
      toEmail = AdminEmailAddresses.EXPN_GREG_ONLY;
      categories = [EmailCategories.SUBSCRIBER_COUNT_MISMATCH, EmailCategories.TEST_SEND];
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
    subject,
    text: emailString,
    html: emailHtml,
    categories
  };
  await sgMail.send(msg)
    .catch(err => {functions.logger.log(`Error sending email: ${msg} because:`, err); throw new functions.https.HttpsError('internal', err);});

  functions.logger.log('Email sent', msg);
}