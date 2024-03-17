import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { BlogIndexRef, Post, PostKeys } from "../../../shared-models/posts/post.model";
import { logger } from "firebase-functions/v2";
import { convertMillisToTimestamp, convertPostToBlogIndexRef } from "../config/global-helpers";
import { Timestamp } from '@google-cloud/firestore';
import { adminFirestore } from "../config/db-config";
import { SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";

// Update the post in the admin db
const updatePostAndBlogIndexRefOnAdmin = async (post: Post, blogIndexRef: BlogIndexRef) => {
  await adminFirestore.collection(SharedCollectionPaths.POSTS).doc(post[PostKeys.ID]).set(post, {merge: true})
    .catch(err => {logger.log(`Error updating post on admin`, err); throw new HttpsError('internal', err);});
  logger.log('post updated on admin');

  await adminFirestore.collection(SharedCollectionPaths.BLOG_INDEX_REFS).doc(blogIndexRef[PostKeys.ID]).set(blogIndexRef, {merge: true})
    .catch(err => {logger.log(`Error updating blogIndexRef on admin`, err); throw new HttpsError('internal', err);});
  logger.log('blogIndexRef updated on admin');
}

const executeActions = async (post: Post): Promise<Post> => {
  const currentTimestamp = Timestamp.now() as any;

  // Configure the post and blogIndexRef for creation
  const postWithTimestamps: Post = {
    ...post,
    [PostKeys.CREATED_TIMESTAMP]: convertMillisToTimestamp(post[PostKeys.CREATED_TIMESTAMP] as number) as any,
    [PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP]: post[PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP] ? convertMillisToTimestamp(post[PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP] as number) as any : null,
    [PostKeys.LAST_MODIFIED_TIMESTAMP]: currentTimestamp,
    [PostKeys.PUBLISHED_TIMESTAMP]: post[PostKeys.PUBLISHED_TIMESTAMP] ? convertMillisToTimestamp(post[PostKeys.PUBLISHED_TIMESTAMP] as number) as any : null,
    [PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP]: post[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP] ? convertMillisToTimestamp(post[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP] as number) as any : null,
  };

  const blogIndexRefWithTimestamps: BlogIndexRef = convertPostToBlogIndexRef(postWithTimestamps);

  await updatePostAndBlogIndexRefOnAdmin(postWithTimestamps, blogIndexRefWithTimestamps);

  return postWithTimestamps;
}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true,
};

export const onCallUpdatePost = onCall(callableOptions, async (request: CallableRequest<Post>): Promise<Post> => {
  const postData = request.data;
  logger.log('onCallUpdatePost requested with this data:', postData);

  const post = await executeActions(postData);

  return post;
});
