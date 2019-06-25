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

    // TODO: (maybe) If last sub source is not purchase, send email to subscriber welcoming them to Explearning, bcc greg@myexplearning

    const sgMail = getSgMail();
    const subName = (newSubscriber.publicUserData.billingDetails as BillingDetails).firstName ? (newSubscriber.publicUserData.billingDetails as BillingDetails).firstName : undefined;
    let subEmail: string;
    let bccEmail = undefined;

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

    const msg = {
      to: {
        email: subEmail,
        name: subName
      },
      from: {
        email: 'hello@myexplearning.com',
        name: 'Explearning',
      },
      bcc: bccEmail, // bcc me if this is a real delivery
      templateId: 'd-a5178c4ee40244649122e684d244f6cc',
      dynamic_template_data: {
        firstName: subName as string, // Will populate first name greeting if name exists
      },
    };
    await sgMail.send(msg)
      .catch(err => console.log(`Error sending email: ${msg} because `, err));

    console.log('Email sent', msg);
  }

  return subFbRes;
})



