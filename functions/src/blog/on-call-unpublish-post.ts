import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { BlogIndexRef, Post, PostKeys } from "../../../shared-models/posts/post.model";
import { logger } from "firebase-functions/v2";
import { adminFirestore, getPublicFirestoreWithAdminCreds } from "../config/db-config";
import { SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { convertPostToBlogIndexRef, fetchAdminPostById } from "../config/global-helpers";
import { SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";

// Update the post in the admin db
const unpublishPostOnAdmin = async (updatedPost: Post, updatedBlogIndexRef: BlogIndexRef) => {
  await adminFirestore.collection(SharedCollectionPaths.POSTS).doc(updatedPost[PostKeys.ID]).set(updatedPost, {merge: true})
    .catch(err => {logger.log(`Error unpublishing post on admin`, err); throw new HttpsError('internal', err);});
  logger.log('post unpublished on admin');

  await adminFirestore.collection(SharedCollectionPaths.BLOG_INDEX_REFS).doc(updatedBlogIndexRef[PostKeys.ID]).set(updatedBlogIndexRef, {merge: true})
    .catch(err => {logger.log(`Error unpublishing blogIndexRef on admin`, err); throw new HttpsError('internal', err);});
  logger.log('blogIndexRef unpublished on admin');
}

// Delete the post and blogIndexRef on the public db
const deletePostOnPublic = async (postToDelete: Post, blogIndexRefToDelete: BlogIndexRef) => {
  const publicFirestoreWithAdminCreds = getPublicFirestoreWithAdminCreds();

  await publicFirestoreWithAdminCreds.collection(SharedCollectionPaths.POSTS).doc(postToDelete[PostKeys.ID]).delete()
    .catch(err => {logger.log(`Error unpublishing post on public`, err); throw new HttpsError('internal', err);});
  logger.log('post deleted on public');

  await publicFirestoreWithAdminCreds.collection(SharedCollectionPaths.BLOG_INDEX_REFS).doc(blogIndexRefToDelete[PostKeys.ID]).delete()
    .catch(err => {logger.log(`Error unpublishing blogIndexRef on public`, err); throw new HttpsError('internal', err);});
  logger.log('blogIndexRef deleted on public');
}

const unpublishPostOnAdminAndPublic = async (post: Post) => {
  // Configure the post and blogIndexRef for unpublish
  const updatedPost: Post = {
    ...post,
    [PostKeys.PUBLISHED]: false,
  };
  const updatedBlogIndexRef: BlogIndexRef = convertPostToBlogIndexRef(updatedPost);
  
  // First delete post on public
  await deletePostOnPublic(updatedPost, updatedBlogIndexRef);

  // Then update post on admin
  await unpublishPostOnAdmin(updatedPost, updatedBlogIndexRef);
}

const executeActions = async (postId: string) => {
  
  const post = await fetchAdminPostById(postId);
  await unpublishPostOnAdminAndPublic(post);
}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true,
  secrets: [SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS]
};

export const onCallUnpublishPost = onCall(callableOptions, async (request: CallableRequest<string>) => {
  const postId = request.data;
  logger.log('onCallUnpublishPost requested with this data:', postId);

  await executeActions(postId);
});