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

const sendSubConfirmationEmail = async (subscriber: EmailSubscriber) => {
  const sgMail = getSgMail();
  const fromEmail = 'hello@myexplearning.com';
  const fromName = 'Explearning';
  const subFirstName = (subscriber.publicUserData.billingDetails as BillingDetails).firstName ? (subscriber.publicUserData.billingDetails as BillingDetails).firstName : undefined;
  let subEmail: string;
  let bccEmail = undefined;
  const templateId = 'd-a5178c4ee40244649122e684d244f6cc'; // Subscription Confirmation id
  const unsubscribeGroupId = 10288; // Communications Strategies Unsubscribe Group

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      subEmail = subscriber.id;
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
    },
    trackingSettings: {
      subscriptionTracking: {
        enable: true, // Enable tracking in order to catch the unsubscribe webhook
      },
    },
    asm: {
      groupId: unsubscribeGroupId, // Set the unsubscribe group
    },
  };
  await sgMail.send(msg)
    .catch(err => console.log(`Error sending email: ${msg} because `, err));

  console.log('Email sent', msg);
}

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeEmailSub = functions.pubsub.topic(AdminFunctionNames.SAVE_EMAIL_SUB_TOPIC).onPublish( async (message, context) => {

  console.log('Context from pubsub', context);
  const subscriber = message.json as EmailSubscriber;
  console.log('Message from pubsub', subscriber);

  const subId = subscriber.id;

  const db = adminFirestore;
  const subDoc: FirebaseFirestore.DocumentSnapshot = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).get()
    .catch(error => {
      console.log('Error fetching subscriber doc', error)
      return error;
    });

  let subFbRes;
  
  // Take action based on whether or not subscriber exists
  if (subDoc.exists) {

    // Actions if subscriber does exist

    const oldSubData: EmailSubscriber = subDoc.data() as EmailSubscriber;
    
    // Merge lastSubSource to the existing subscriptionSources array
    const existingSubSources = oldSubData.subscriptionSources; // Fetch existing sub sources
    const updatedSubSources = [...existingSubSources, subscriber.lastSubSource];

    const updatedSubscriber: EmailSubscriber = {
      ...subscriber,
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
      ...subscriber,
      subscriptionSources: [subscriber.lastSubSource],
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
  if (!subscriber.introEmailSent && subscriber.lastSubSource !== SubscriptionSource.CONTACT_FORM) {
    await sendSubConfirmationEmail(subscriber)
      .catch(error => console.log('Error in send email function', error));

    // Mark sent
    const updatedSubscriber: EmailSubscriber = {
      ...subscriber,
      introEmailSent: true
    }
    
    await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).update(updatedSubscriber)
      .catch(error => {
        console.log('Error marking intro email sent', error)
        return error;
      });
      console.log('Marked email sent', subFbRes);
  }

  return subFbRes;
})



