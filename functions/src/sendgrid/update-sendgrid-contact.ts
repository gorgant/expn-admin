import * as functions from 'firebase-functions';
import * as request from 'request';
import { sendgridSecret } from './config';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { EmailSubscriber } from '../../../shared-models/subscribers/email-subscriber.model';
import { BillingDetails } from '../../../shared-models/billing/billing-details.model';
import { currentEnvironmentType, adminProjectId } from '../environments/config';
import { EnvironmentTypes } from '../../../shared-models/environments/env-vars.model';
import { EmailContactListIds, EmailCategories } from '../../../shared-models/email/email-vars.model';
import { SendgridStandardJobResponse, SendgridImportStatusResponse, SendgridSearchContactsResponse } from '../../../shared-models/email/sendgrid-job-response.model';
import { adminFirestore } from '../db';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';
import { PubSub } from '@google-cloud/pubsub';

const pubSub = new PubSub();
const db = adminFirestore;
const sendgridApiKey = sendgridSecret;
const contactsApiUrl = 'https://api.sendgrid.com/v3/marketing/contacts';
const newsletterListId = EmailContactListIds.EXPLEARNING_COMMUNICATIONS_STRATEGIES;
const wildcardParamKey = 'subscriberId'; // Can use any value here, will represent the doc ID

const submitRequest = async (requestOptions: request.Options): Promise<{}> => {
  // Wrap the request in a promise
  const responseBody: Promise<string> = new Promise<string> ( async(resolve, reject) => {
    
    // Submit the request using the options and body set above
    request(requestOptions, (error, response, body) => {
      
      if (error) {
        reject(`Error with request to sendgrid: ${error}`);
        throw new Error(error);
      }

      if (response.statusCode >= 400) {
        reject(`400 status detected from request to sendgrid: ${response.statusCode} ${response.statusMessage}`);
        throw new Error(`Error with request to sendgrid: ${response.statusCode} ${response.statusMessage}`);
      }

      console.log('Body from request', body);

      console.log('Response in string form', JSON.stringify(response));

      resolve(body);

    });

  });

  return responseBody;
}

const getImportStatus = async (jobId: string): Promise<SendgridImportStatusResponse> => {

  // Encode reserved characters found in URL (may not be necessary)
  const safeUrl = jobId.replace(/[!'()*]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16);
  });

  const requestUrl = `${contactsApiUrl}/imports/${safeUrl}`;

  const requestOptions: request.Options = {
    method: 'GET',
    url: requestUrl,
    headers: 
      { 
        'content-type': 'application/json',
        authorization: `Bearer ${sendgridApiKey}` 
      }
  };

  console.log('Checking job status with these options', requestOptions);

  const importStatusResponse: SendgridImportStatusResponse = await submitRequest(requestOptions)
    .catch(error => {
      console.log('Error submitting request');
      return error;
    });

    
  console.log('Got this job status:', importStatusResponse);
  // const parsedResponse: SengridImportStatusResponse = JSON.parse(importStatusResponse);
  // console.log(`Here's the parsed version ${parsedResponse}`);
  
  return importStatusResponse;
}

// Make five attempts over several seconds to check if SG update was complete
const checkUpdateComplete = async (jobId: string): Promise<boolean> => {
  
  let attemptCount = 0;
  let jobDone = false;
  let importStatusResponse: any;
  
  while(!jobDone && attemptCount < 5) {
    importStatusResponse = await getImportStatus(jobId);

    const parsedStatusResponse: SendgridImportStatusResponse = JSON.parse(importStatusResponse);

    // Check if job is done, return true if it is, otherwise wait a second and return false
    // If job not complete, wait and try again
    jobDone = await new Promise<boolean>((resolve, reject) => {
      console.log('initiating jobDoneCheckPromise with this importStatusResponse', parsedStatusResponse)

      // It takes a while for import to be marked complete, created_count seems to update faster so that's an alternative signal
      // If job not complete, wait a second and try again
      if (
          parsedStatusResponse.status !== 'completed' && 
          !parsedStatusResponse.results.created_count && 
          !parsedStatusResponse.results.updated_count
        ) {
        setTimeout(() => {
          resolve(false);
        }, 3000)
      } else {
        resolve(true);
      }
    });


    attemptCount ++;
  }

  console.log(`Completed check for update with outcome of ${jobDone} after ${attemptCount} attempts`);
  return jobDone;
}

// Queries sendgrid for a specific email address and returns the user ID
const getSendgridContactId = async (email: string): Promise<string | null> => {

  const requestUrl = `${contactsApiUrl}/search`;
  const requestBody = { 
    query: `email LIKE '${email}'` // accepts most SQL queries such as AND CONTAINS...
  };
  const requestOptions: request.Options = {
    method: 'POST',
    url: requestUrl,
    headers: 
      { 
        'content-type': 'application/json',
        authorization: `Bearer ${sendgridApiKey}` 
      },
    body: requestBody,
    json: true
  };

  console.log('Searching SG for contact with these options', requestOptions);

  const searchResponse: SendgridSearchContactsResponse = await submitRequest(requestOptions)
    .catch(error => {
      console.log('Error submitting request', error);
      return error;
    });
  
  if (searchResponse.contact_count < 1) {
    console.log('No contacts found, aborting getSendgridContactId with null value');
    return null;
  }

  const subId = searchResponse.result[0].id;
  console.log('Found contact with this id:', subId);
  
  return subId;

}

const deleteSendgridContact = async (subscriber: EmailSubscriber): Promise<SendgridStandardJobResponse | null> => {

  let contactId: string;

  if (subscriber.sendgridContactId) {
    contactId = subscriber.sendgridContactId;
  } else {
    contactId = await getSendgridContactId(subscriber.id) as string;
  }


  if (!contactId) {
    console.log('No contact id available, aborting deleteSendgridContact with null value');
    return null;
  }

  const queryParams = {
    ids: contactId 
  };

  const requestUrl = contactsApiUrl;
  const requestOptions: request.Options = {
    method: 'DELETE',
    url: requestUrl,
    qs: queryParams,
    headers: 
      { 
        authorization: `Bearer ${sendgridApiKey}` 
      }
  };

  console.log('Transmitting delete request with these options', requestOptions);
  
  const sgJobResponse: SendgridStandardJobResponse = await submitRequest(requestOptions)
    .catch(error => {
      console.log('Error submitting request');
      return error;
    });

  return sgJobResponse;

}

const createOrUpdateSendgridContact = async (subscriber: EmailSubscriber): Promise <SendgridStandardJobResponse> => {

  const firstName = (subscriber.publicUserData.billingDetails as BillingDetails).firstName;
  const email = subscriber.id;
  const requestUrl = contactsApiUrl;

  // Many more fields available, check api docs if needed (https://sendgrid.com/docs/API_Reference/api_v3.html)
  const requestBody = { 
    list_ids: [ 
      newsletterListId 
    ],
    contacts: [ 
      { 
        email,
        first_name: firstName
      } 
    ] 
  };

  // Courtesy of https://sendgrid.com/docs/API_Reference/api_v3.html
  const requestOptions: request.Options = { 
    method: 'PUT',
    url: requestUrl,
    headers: 
      { 
        'content-type': 'application/json',
        authorization: `Bearer ${sendgridApiKey}` 
      },
    body: requestBody,
    json: true 
  };

  console.log('Transmitting SG update with these options', requestOptions);
  
  const sgJobResponse: SendgridStandardJobResponse = await submitRequest(requestOptions)
    .catch(error => {
      console.log('Error submitting request');
      return error;
    });

  return sgJobResponse;

}

// Append Sendgrid Contact Id to Subscriber
const addSendgridContactIdToSubscriber = async (subscriber: EmailSubscriber, contactUpdateJobId?: string) => {

  console.log('Attempting to add sendgrid contact ID to subscriber', subscriber);

  // If contactUpdateJobId provided, use it to screen addition request
  if (contactUpdateJobId) {
    // Wait for sendgrid update job to complete
    const updateJobComplete = await checkUpdateComplete(contactUpdateJobId);
    
    // Abort if update job takes too long (will not be able to fetch contact ID if contact isn't in Sendgrid system yet)
    if (!updateJobComplete) {
      return 'Aborting Subscriber update because Sendgrid update took too long';
    }
  }

  const email = subscriber.id;
  const contactId = await getSendgridContactId(email);

  // Exit if no matching contact found (typically will happen if request takes place right after an upload, which can be slow)
  if (!contactId) {
    console.log('No matching contact found on Sendgrid, aborted addSendgridContactIdToSubscriber');
    return null;
  }
  
  const sendgridContactId: Partial<EmailSubscriber> = {
    sendgridContactId: contactId
  }
  
  const subFbRes = await db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subscriber.id).update(sendgridContactId)
    .catch(error => {
      console.log('Error storing subscriber doc', error)
      return error;
    });
  
  console.log('Added Sendgrid contact ID to subscriber', subFbRes);
  return subFbRes;
}

// Trigger email send
const triggerWelcomeEmail = async(subscriber: EmailSubscriber) => {
  const topicName = AdminTopicNames.TRIGGER_EMAIL_SEND_TOPIC;
  const emailCategory = EmailCategories.WELCOME_EMAIL;
  const topic = pubSub.topic(`projects/${adminProjectId}/topics/${topicName}`);
  const pubsubMsg: EmailPubMessage = {
    emailCategory,
    subscriber
  }
  const topicPublishRes = await topic.publishJSON(pubsubMsg)
    .catch(err => {throw new Error(`Publish to topic ${topicName} failed with error: ${err}`)});
  console.log(`Res from ${topicName}: ${topicPublishRes}`);
}

/////// DEPLOYABLE FUNCTIONS ///////

// Listen for writes to the subscribers collection, courtesy of https://firebase.google.com/docs/functions/firestore-events#writing-triggered_functions
export const updateSendgridContact = functions.firestore.document(`${AdminCollectionPaths.SUBSCRIBERS}/{${wildcardParamKey}}`).onWrite( async (change, context) => {

  const subscriberEmail = context.params[wildcardParamKey];
  console.log('Subscriber collection write detected for this email:', subscriberEmail);

  // Exit function if in sandbox to prevent bad data getting to sendGrid
  if (currentEnvironmentType === EnvironmentTypes.SANDBOX) {
    console.log('Sandbox detected, exit function with no updates to SengGrid');
    return;
  }

  const newSubscriberData: EmailSubscriber | null = change.after.exists ? change.after.data() as EmailSubscriber : null; // Check for deletions
  const oldSubscriberData: EmailSubscriber | null = change.before.exists ? change.before.data() as EmailSubscriber : null; // Check for additions

  const deleteRequest = !newSubscriberData; // If no new subscriber data, document has been deleted
  const noOptInRequested = newSubscriberData && !newSubscriberData.optInConfirmed;
  const optInRequested = oldSubscriberData && newSubscriberData && !oldSubscriberData.optInConfirmed && newSubscriberData.optInConfirmed; // Opt in chagned from false to true
  const subscriberAlreadyOptedIn = oldSubscriberData && oldSubscriberData.optInConfirmed;
  const otherValidSendgridUpdate = oldSubscriberData && // Detect name change
    newSubscriberData && 
    (newSubscriberData.publicUserData.billingDetails as BillingDetails).firstName !== (oldSubscriberData.publicUserData.billingDetails as BillingDetails).firstName;
  const subscriberMissingSGContactId = newSubscriberData && !newSubscriberData.sendgridContactId;

  // Remove contact from Sendgrid
  if (deleteRequest) {
    console.log('Deleting contact from SendGrid');
    await deleteSendgridContact(oldSubscriberData as EmailSubscriber);
    return;
  }

  // Exit function if subscriber not opted in (we only update SG with opted-in subscribers)
  if(noOptInRequested) {
    console.log('Subscriber not yet opted in, exiting function');
    return;
  }

  // If existing subscriber doesn't have a Sengrid contact id, attempt to add it (often fails because contact isn't searchable right after upload)
  if (subscriberAlreadyOptedIn && subscriberMissingSGContactId) {
    await addSendgridContactIdToSubscriber(newSubscriberData as EmailSubscriber)
      .catch(error => {
        console.log('Error adding sengrid contact id to subscriber', error);
        return error;
      });
  }

  // If subscriber is opted in but the update is not a name update, don't transmit updates to Sendgrid
  if (subscriberAlreadyOptedIn && !otherValidSendgridUpdate) {
    console.log('No change to first name detected, exiting function with no further actions');
    return;
  }

  // Create or update Sendgrid Contact
  const contactUpdateJobIdResponse: SendgridStandardJobResponse = await createOrUpdateSendgridContact(newSubscriberData as EmailSubscriber)
    .catch(error => {
      console.log('Error creating Sendgrid contact')
      return error;
    })

  // If this is a new opt in, send welcome email
  if (optInRequested) {

    // Trigger welcome email
    console.log('New subscriber detected, sending welcome email');
    await triggerWelcomeEmail(newSubscriberData as EmailSubscriber)
      .catch(error => {throw new Error(`Error publishing purchase confirmation topic to admin: ${error}`)});
  }

  return contactUpdateJobIdResponse;

});

