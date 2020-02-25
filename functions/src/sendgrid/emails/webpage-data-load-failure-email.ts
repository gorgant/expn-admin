import { getSgMail } from "../config";
import { EmailSenderAddresses, EmailSenderNames, EmailCategories, AdminEmailAddresses } from "../../../../shared-models/email/email-vars.model";
import { currentEnvironmentType } from "../../config/environments-config";
import { EnvironmentTypes } from "../../../../shared-models/environments/env-vars.model";
import { MailData } from "@sendgrid/helpers/classes/mail";
import { WebpageLoadFailureData } from '../../../../shared-models/ssr/webpage-load-failure-data.model';


export const sendWebpageDataLoadFailureEmail = async (webpageLoadFailureData: WebpageLoadFailureData ) => {
  
  console.log('Sending Webpage Data Load Failure Email to admin');
  
  const sgMail = getSgMail();
  const fromEmail: string = EmailSenderAddresses.EXPLEARNING_ADMIN;
  const fromName: string = EmailSenderNames.EXPLEARNING_ADMIN;
  const toFirstName: string = 'Administrator';
  let toEmail: string;
  const subject: string = '[Automated Error Service] Webpage Data Load Failure';
  let categories: string[];
  const emailString: string = `Administrators, An error occurred when attempting to load a webpage. Domain: ${webpageLoadFailureData.domain}. Url Path: ${webpageLoadFailureData.urlPath}. Error Message: ${webpageLoadFailureData.errorMessage}. To fix the issue, consider deleting the webpageCache for that route in the public database and then manually loading the webpage. Good luck! Automated Error Service.`
  const emailHtml: string = `<p>Administrators,</p>\
    <p>An error occurred when attempting to load a webpage:</p>\
    <ul>\
      <li>Domain: ${webpageLoadFailureData.domain}</li>\
      <li>Url Path: ${webpageLoadFailureData.urlPath}</li>\
      <li>Error Message: ${webpageLoadFailureData.errorMessage}</li>\
    </ul>\
    <p>To fix the issue, consider deleting the webpageCache for that route in the public database and then manually loading the webpage.</p>\
    <p>Good luck!</p>\
    <p>Automated Error Service</p>\
    `
  
  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      toEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      categories = [EmailCategories.WEBPAGE_DATA_LOAD_FAILURE];
      break;
    case EnvironmentTypes.SANDBOX:
      toEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      categories = [EmailCategories.WEBPAGE_DATA_LOAD_FAILURE, EmailCategories.TEST_SEND];
      break;
    default:
      toEmail = AdminEmailAddresses.EXPLEARNING_GREG_ONLY;
      categories = [EmailCategories.WEBPAGE_DATA_LOAD_FAILURE, EmailCategories.TEST_SEND];
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
    subject,
    text: emailString,
    html: emailHtml,
    categories
  };
  await sgMail.send(msg)
    .catch(err => {console.log(`Error sending email: ${msg} because:`, err); return err});

  console.log('Email sent', msg);
}