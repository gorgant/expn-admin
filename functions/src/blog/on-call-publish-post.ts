import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { BlogIndexRef, Post, PostKeys } from "../../../shared-models/posts/post.model";
import { logger } from "firebase-functions/v2";
import { adminFirestore, getPublicFirestoreWithAdminCreds } from "../config/db-config";
import { SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { Timestamp } from '@google-cloud/firestore';
import { convertPostToBlogIndexRef, fetchAdminPostById } from "../config/global-helpers";
import { SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";

// Update the post in the admin db
const publishPostOnAdmin = async (updatedPost: Post, updatedBlogIndexRef: BlogIndexRef) => {
  await adminFirestore.collection(SharedCollectionPaths.POSTS).doc(updatedPost[PostKeys.ID]).set(updatedPost, {merge: true})
    .catch(err => {logger.log(`Error publishing post on admin`, err); throw new HttpsError('internal', err);});
  logger.log('post published on admin');

  await adminFirestore.collection(SharedCollectionPaths.BLOG_INDEX_REFS).doc(updatedBlogIndexRef[PostKeys.ID]).set(updatedBlogIndexRef, {merge: true})
    .catch(err => {logger.log(`Error publishing blogIndexRef on admin`, err); throw new HttpsError('internal', err);});
  logger.log('blogIndexRef published on admin');
}

// Create the post and blogIndexRef in the public db
const publishPostOnPublic = async (updatedPost: Post, updatedBlogIndexRef: BlogIndexRef) => {
  const publicFirestoreWithAdminCreds = getPublicFirestoreWithAdminCreds();
  
  await publicFirestoreWithAdminCreds.collection(SharedCollectionPaths.POSTS).doc(updatedPost[PostKeys.ID]).set(updatedPost)
    .catch(err => {logger.log(`Error publishing post on public`, err); throw new HttpsError('internal', err);});
  logger.log('post published on public');

  await publicFirestoreWithAdminCreds.collection(SharedCollectionPaths.BLOG_INDEX_REFS).doc(updatedBlogIndexRef[PostKeys.ID]).set(updatedBlogIndexRef)
    .catch(err => {logger.log(`Error publishing blogIndexRef on public`, err); throw new HttpsError('internal', err);});
  logger.log('blogIndexRef published on public');
}

// Used in the auto publish function as well
export const publishPostOnAdminAndPublic = async (post: Post) => {
  const currentTimestamp = Timestamp.now() as any;
  // Configure the post and blogIndexRef for publish
  const updatedPost: Post = {
    ...post,
    [PostKeys.PUBLISHED]: true,
    [PostKeys.PUBLISHED_TIMESTAMP]: post[PostKeys.PUBLISHED_TIMESTAMP] ? post[PostKeys.PUBLISHED_TIMESTAMP] : currentTimestamp, // Only add publish date if doesn't already exist
    [PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP]: null as any // Clear the scheduled time when published in the event that this was a scheduled post
  };
  const updatedBlogIndexRef: BlogIndexRef = convertPostToBlogIndexRef(updatedPost);

  await publishPostOnPublic(updatedPost, updatedBlogIndexRef);
  await publishPostOnAdmin(updatedPost, updatedBlogIndexRef);
}

const executeActions = async (postId: string) => {
  const post = await fetchAdminPostById(postId);
  await publishPostOnAdminAndPublic(post);
}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true,
  secrets: [SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS]
};

export const onCallPublishPost = onCall(callableOptions, async (request: CallableRequest<string>) => {
  const postId = request.data;
  logger.log('onCallPublishPost requested with this data:', postId);

  await executeActions(postId);
 
});
