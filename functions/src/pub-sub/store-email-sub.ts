import * as functions from 'firebase-functions';
import { adminFirestore } from '../db';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { EmailSubscriber } from '../../../shared-models/subscribers/email-subscriber.model';
import { now } from 'moment';
import { AdminFunctionNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { getSgMail } from '../sendgrid/config';
import { BillingDetails } from '../../../shared-models/billing/billing-details.model';
import { currentEnvironmentType } from '../environments/config';
import { EnvironmentTypes } from '../../../shared-models/environments/env-vars.model';
import { MailData } from '@sendgrid/helpers/classes/mail';
import { SubscriptionSource } from '../../../shared-models/subscribers/subscription-source.model';
import { EmailTemplateIds, EmailSenderAddresses, EmailSenderNames, EmailBccAddresses, EmailCategories } from '../../../shared-models/email/email-vars.model';

const sendSubConfirmationEmail = async (subscriber: EmailSubscriber) => {
  const sgMail = getSgMail();
  const fromEmail = EmailSenderAddresses.DEFAULT;
  const fromName = EmailSenderNames.DEFAULT;
  const toFirstName = (subscriber.publicUserData.billingDetails as BillingDetails).firstName ? (subscriber.publicUserData.billingDetails as BillingDetails).firstName : undefined;
  let toEmail: string;
  let bccEmail = undefined;
  const templateId = EmailTemplateIds.SUBSCRIPTION_CONFIRMATION;
  const unsubscribeGroupId = 10288; // Communications Strategies Unsubscribe Group

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      toEmail = subscriber.id;
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
    },
    trackingSettings: {
      subscriptionTracking: {
        enable: true, // Enable tracking in order to catch the unsubscribe webhook
      },
    },
    asm: {
      groupId: unsubscribeGroupId, // Set the unsubscribe group
    },
    category: EmailCategories.SUBSCRIPTION_CONFIRMATION
  };
  await sgMail.send(msg)
    .catch(err => console.log(`Error sending email: ${msg} because `, err));

  console.log('Email sent', msg);
}

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeEmailSub = functions.pubsub.topic(AdminFunctionNames.SAVE_EMAIL_SUB_TOPIC).onPublish( async (message, context) => {

  console.log('Context from pubsub', context);
  const newSubscriberData = message.json as EmailSubscriber;
  console.log('Message from pubsub', newSubscriberData);

  const subId = newSubscriberData.id;

  const db = adminFirestore;
  const subDoc: FirebaseFirestore.DocumentSnapshot = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).get()
    .catch(error => {
      console.log('Error fetching subscriber doc', error)
      return error;
    });
  // let subscriberExists: boolean;
  let existingSubscriberData: EmailSubscriber | undefined = undefined // Will be assigned if it exists

  let subFbRes;
  
  // Take action based on whether or not subscriber exists
  if (subDoc.exists) { 

    // Actions if subscriber does exist
    // subscriberExists = true; // Used for the email delivery 
    existingSubscriberData = subDoc.data() as EmailSubscriber;
    
    // Merge lastSubSource to the existing subscriptionSources array
    const existingSubSources = existingSubscriberData.subscriptionSources; // Fetch existing sub sources
    const updatedSubSources = [...existingSubSources, newSubscriberData.lastSubSource];

    const updatedSubscriber: EmailSubscriber = {
      ...newSubscriberData,
      subscriptionSources: updatedSubSources,
    }
    console.log('Updating subscriber with this data', updatedSubscriber);

    subFbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).update(updatedSubscriber)
      .catch(error => {
        console.log('Error storing subscriber doc', error)
        return error;
      });
      console.log('Existing subscriber updated', subFbRes);

  } else {

    // Actions if subscriber doesn't exist

    // Create new subscriber with a fresh subscriptionSource array
    const newSubscriber: EmailSubscriber = {
      ...newSubscriberData,
      subscriptionSources: [newSubscriberData.lastSubSource],
      createdDate: now()
    };
    console.log('Creating subscriber with this data', newSubscriber);

    subFbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).set(newSubscriber)
      .catch(error => {
        console.log('Error storing subscriber doc', error)
        return error;
      });

    console.log('New subscriber created', subFbRes);




    
  }

  // Send intro email if none has been sent and it's not a contact form
  if (existingSubscriberData && existingSubscriberData.introEmailSent) {
    console.log('Subscriber has already received an intro email, will not send', existingSubscriberData);
  };

  if (
    newSubscriberData.lastSubSource !== SubscriptionSource.CONTACT_FORM && // Don't send if contact form
    (!existingSubscriberData || !existingSubscriberData.introEmailSent) // Send if no existing subscriber data or if no intro email sent
  ) {
    console.log('Subscriber has not received an intro email and this is not a contact form, sending intro email', existingSubscriberData);
    await sendSubConfirmationEmail(newSubscriberData)
      .catch(error => console.log('Error in send email function', error));

    // Mark sent
    const introEmailSent: Partial<EmailSubscriber> = {
      introEmailSent: true
    }
    
    await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).update(introEmailSent)
      .catch(error => {
        console.log('Error marking intro email sent', error)
        return error;
      });
      console.log('Marked email sent', subFbRes);
  }

  return subFbRes;
})



