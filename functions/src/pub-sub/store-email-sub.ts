import * as functions from 'firebase-functions';
import { adminFirestore } from '../config/db-config';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { EmailSubscriber } from '../../../shared-models/subscribers/email-subscriber.model';
import { now } from 'moment';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { SubscriptionSource } from '../../../shared-models/subscribers/subscription-source.model';
import { EmailCategories } from '../../../shared-models/email/email-vars.model';
import { PubSub } from '@google-cloud/pubsub';
import { adminProjectId } from '../config/environments-config';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';
import { catchErrors } from '../config/global-helpers';

const pubSub = new PubSub();

// Trigger email send
const triggerOptInEmail = async(subscriber: EmailSubscriber) => {
  const topicName = AdminTopicNames.TRIGGER_EMAIL_SEND_TOPIC;
  const projectId = adminProjectId;
  const emailCategory = EmailCategories.OPT_IN_CONFIRMATION;
  const topic = pubSub.topic(`projects/${projectId}/topics/${topicName}`);
  const pubsubMsg: EmailPubMessage = {
    emailCategory,
    subscriber
  }
  const topicPublishRes = await topic.publishJSON(pubsubMsg)
    .catch(err => {console.log(`Failed to publish to topic "${topicName}" on project "${projectId}":`, err); return err;});
  console.log(`Publish to topic "${topicName}" on project "${projectId}" succeeded:`, topicPublishRes);
}

const executeActions = async (susbscriberData: EmailSubscriber) => {
  const newSubscriberData = susbscriberData;
  const subId = newSubscriberData.id;

  const db = adminFirestore;
  const subDoc: FirebaseFirestore.DocumentSnapshot = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).get()
    .catch(err => {console.log('Error fetching subscriber doc:', err); return err;});

  let existingSubscriberData: EmailSubscriber | undefined = undefined // Will be assigned if it exists
  let subFbRes;

  const isExistingSubscriber: boolean = subDoc.exists;
  let subscriberHasOptedIn: boolean = false;
  const isContactForm: boolean = newSubscriberData.lastSubSource === SubscriptionSource.CONTACT_FORM;
  
  // Actions if is an existing subscriber
  if (isExistingSubscriber) { 

    existingSubscriberData = subDoc.data() as EmailSubscriber;

    if (existingSubscriberData.optInConfirmed) {
      subscriberHasOptedIn = true;
    };
    
    // Merge lastSubSource to the existing subscriptionSources array
    const existingSubSources = existingSubscriberData.subscriptionSources; // Fetch existing sub sources
    const updatedSubSources = [...existingSubSources, newSubscriberData.lastSubSource];

    const updatedSubscriber: EmailSubscriber = {
      ...newSubscriberData,
      subscriptionSources: updatedSubSources,
    }
    console.log('Updating subscriber with this data', updatedSubscriber);

    subFbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).update(updatedSubscriber)
      .catch(err => {console.log('Error storing subscriber doc:', err); return err;});
    console.log('Existing subscriber updated', subFbRes);

  };

  // Actions if subscriber doesn't exist
  if (!isExistingSubscriber) {
    // Create new subscriber with a fresh subscriptionSource array
    const newSubscriber: EmailSubscriber = {
      ...newSubscriberData,
      subscriptionSources: [newSubscriberData.lastSubSource],
      createdDate: now()
    };
    console.log('Creating subscriber with this data', newSubscriber);

    subFbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId).set(newSubscriber)
      .catch(err => {console.log('Error storing subscriber doc:', err); return err;});
    console.log('New subscriber created', subFbRes);
  };

  // Don't send anything if optInConfirmed === true
  if (subscriberHasOptedIn) {
    console.log('Subscriber has already opted in, will not send opt-in email', existingSubscriberData);
  };

  // Send if NOT a contact form request and if subscriber hasn't opted in
  if (!isContactForm && !subscriberHasOptedIn) {
    
    console.log('Subscriber has not opted in yet and this is not a contact form, sending opt in confirmation email');
    // Trigger opt in email
    await triggerOptInEmail(newSubscriberData)
      .catch(err => {console.log('Error publishing opt in email topic to admin:', err); return err;});
  }

}


/////// DEPLOYABLE FUNCTIONS ///////

// Listen for pubsub message
export const storeEmailSub = functions.pubsub.topic(AdminTopicNames.SAVE_EMAIL_SUB_TOPIC).onPublish( async (message, context) => {

  const subscriberData = message.json as EmailSubscriber;
  console.log('Store email sub request received with this data:', subscriberData);
  console.log('Context from pubsub', context);

  return catchErrors(executeActions(subscriberData));

});



