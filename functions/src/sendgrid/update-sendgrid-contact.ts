import * as functions from 'firebase-functions';
import * as request from 'request';
import { sendgridSecret } from './config';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { EmailSubscriber } from '../../../shared-models/subscribers/email-subscriber.model';
import { BillingDetails } from '../../../shared-models/billing/billing-details.model';
import { currentEnvironmentType } from '../environments/config';
import { EnvironmentTypes } from '../../../shared-models/environments/env-vars.model';
import { EmailContactListIds } from '../../../shared-models/email/email-vars.model';

const sendgridApiKey = sendgridSecret;
const contactsApiUrl = 'https://api.sendgrid.com/v3/marketing/contacts';
const newsletterListId = EmailContactListIds.EXPLEARNING_COMMUNICATIONS_STRATEGIES;
const wildcardParamKey = 'subscriberId'; // Can use any value here, will represent the doc ID

const submitRequest = async (requestOptions: request.Options): Promise<string> => {
  // Wrap the request in a promise
  const responseBody: Promise<string> = new Promise<string> ( async(resolve, reject) => {
    
    // Submit the request using the options and body set above
    request(requestOptions, (error, response, body) => {
      
      if (error) {
        reject(`Error with request to sendgrid: ${error}`);
      } 

      console.log('Body from request', body);

      console.log('Response in string form', JSON.stringify(response));

      resolve(body);

    });

  });

  return responseBody;
}

// Queries sendgrid for a specific email address and returns the user ID
const getSendgridContactId = async (email: string): Promise<string> => {

  const requestUrl = `${contactsApiUrl}/search`;
  const requestBody = { 
    query: `email LIKE \'${email}\'` // accepts most SQL queries such as AND CONTAINS...
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

  const requestResponseBody = await (submitRequest(requestOptions)
    .catch(error => {
      console.log('Error submitting request');
      return error;
    }) as any);

  const subId = requestResponseBody.result[0].id;
  console.log('Found contact with this id:', subId);
  
  return subId;

}

const deleteSendgridContact = async (email: string): Promise<string> => {

  const contactId = await getSendgridContactId(email);

  const params = {
    ids: contactId 
  };

  const requestUrl = contactsApiUrl;
  const requestOptions: request.Options = {
    method: 'DELETE',
    url: requestUrl,
    qs: params,
    headers: 
      { 
        authorization: `Bearer ${sendgridApiKey}` 
      }
  };

  console.log('Transmitting delete request with these options', requestOptions);
  
  const requestResponseBody = await submitRequest(requestOptions)
    .catch(error => {
      console.log('Error submitting request');
      return error;
    });

  return requestResponseBody;

}

const createSendgridContact = async (email: string, firstName: string): Promise <string> => {

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
  
  const requestResponseBody = await submitRequest(requestOptions)
    .catch(error => {
      console.log('Error submitting request');
      return error;
    });
  
  return requestResponseBody;

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

  // If no subscriber data, it has been deleted, so remove from Sendgrid
  if (!newSubscriberData) {
    console.log('Deleting contact from SendGrid');
    await deleteSendgridContact(subscriberEmail);
    return;
  }

  if (oldSubscriberData && (newSubscriberData.publicUserData.billingDetails as BillingDetails).firstName === (oldSubscriberData.publicUserData.billingDetails as BillingDetails).firstName) {
    // Exit function because subscriber update doesn't relate to sendgrid data
    console.log('No change to first name detected, exiting function with no actions');
    return;
  }

  const firstName = (newSubscriberData.publicUserData.billingDetails as BillingDetails).firstName;

  const sendgridTransmissionResults = await createSendgridContact(subscriberEmail, firstName)
    .catch(error => {
      console.log('Error creating Sendgrid contact')
      return error;
    })
  
  return sendgridTransmissionResults;

});

