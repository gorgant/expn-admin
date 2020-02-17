import * as functions from 'firebase-functions';
import { submitCacheUpdateRequest } from './submit-cache-update-request';
import { generateBlogUrlObject } from './helpers';


/////// DEPLOYABLE FUNCTIONS ///////


export const refreshPublicBlogCache = functions.https.onCall(async (data: any, context) => {
  console.log('Received request to refresh public blog cache with this data', data);

  const blogUrlObject = generateBlogUrlObject();
  
  await submitCacheUpdateRequest(blogUrlObject);
  
  return;
});