import * as functions from 'firebase-functions';
import { submitCacheUpdateRequest } from './submit-cache-update-request';
import { generateHomeUrlObject } from './helpers';


/////// DEPLOYABLE FUNCTIONS ///////


export const refreshPublicFeaturedPostsCache = functions.https.onCall(async (data: any, context) => {
  console.log('Received request to refresh public home cache with this data', data);

  const blogUrlObject = generateHomeUrlObject();
  
  await submitCacheUpdateRequest(blogUrlObject);
  
  return;
});