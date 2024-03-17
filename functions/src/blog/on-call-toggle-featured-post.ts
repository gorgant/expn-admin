import { logger } from "firebase-functions/v2";
import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { adminFirestore, getPublicFirestoreWithAdminCreds } from "../config/db-config";
import { BlogIndexRef, Post, PostKeys } from "../../../shared-models/posts/post.model";
import { convertPostToBlogIndexRef, fetchAdminPostById } from "../config/global-helpers";
import { SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";

// Update the post in the admin db
const updatePostOnAdmin = async (updatedPost: Post, updatedBlogIndexRef: BlogIndexRef) => {
  await adminFirestore.collection(SharedCollectionPaths.POSTS).doc(updatedPost[PostKeys.ID]).set(updatedPost, {merge: true})
    .catch(err => {logger.log(`Error toggling featured post on admin`, err); throw new HttpsError('internal', err);});
  logger.log('featured post toggled on admin');

  await adminFirestore.collection(SharedCollectionPaths.BLOG_INDEX_REFS).doc(updatedBlogIndexRef[PostKeys.ID]).set(updatedBlogIndexRef, {merge: true})
    .catch(err => {logger.log(`Error toggling featured blogIndexRef on admin`, err); throw new HttpsError('internal', err);});
  logger.log('featured blogIndexRef toggled on admin');
}

// Update the post and blogIndexRef in the public db
const updatePostOnPublic = async (updatedPost: Post, updatedBlogIndexRef: BlogIndexRef) => {
  const publicFirestoreWithAdminCreds = getPublicFirestoreWithAdminCreds();

  await publicFirestoreWithAdminCreds.collection(SharedCollectionPaths.POSTS).doc(updatedPost[PostKeys.ID]).set(updatedPost, {merge: true})
    .catch(err => {logger.log(`Error toggling featured post on public`, err); throw new HttpsError('internal', err);});
  logger.log('featured post toggled on public');

  await publicFirestoreWithAdminCreds.collection(SharedCollectionPaths.BLOG_INDEX_REFS).doc(updatedBlogIndexRef[PostKeys.ID]).set(updatedBlogIndexRef, {merge: true})
    .catch(err => {logger.log(`Error toggling featured blogIndexRef on public`, err); throw new HttpsError('internal', err);});
  logger.log('blogIndexRef updated on public');
}

const togglePostOnAdminAndPublic = async (post: Post) => {
  // Configure the post and blogIndexRef for toggle
  const updatedPostToToggle: Post = {
    ...post,
    [PostKeys.FEATURED]: !post[PostKeys.FEATURED]
  };

  const updatedBlogIndexRef: BlogIndexRef = convertPostToBlogIndexRef(updatedPostToToggle);

    await updatePostOnPublic(updatedPostToToggle, updatedBlogIndexRef);
    await updatePostOnAdmin(updatedPostToToggle, updatedBlogIndexRef);


}


const executeActions = async (postId: string) => {
  const post = await fetchAdminPostById(postId);
  await togglePostOnAdminAndPublic(post);
}


/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true,
  secrets: [SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS]
};

export const onCallToggleFeaturedPost = onCall(callableOptions, async (request: CallableRequest<string>) => {
  const postId = request.data;
  logger.log('onCallToggleFeaturedPost requested with this data:', postId);

  await executeActions(postId);
});