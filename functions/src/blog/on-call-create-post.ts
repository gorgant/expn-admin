import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { BlogIndexRef, Post, PostKeys } from "../../../shared-models/posts/post.model";
import { logger } from "firebase-functions/v2";
import { convertPostToBlogIndexRef } from "../config/global-helpers";
import { Timestamp } from '@google-cloud/firestore';
import { adminFirestore } from "../config/db-config";
import { SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";

// Create the post in the admin db
const createPostAndBlogIndexRefOnAdmin = async (post: Post, blogIndexRef: BlogIndexRef) => {
  await adminFirestore.collection(SharedCollectionPaths.POSTS).doc(post[PostKeys.ID]).set(post)
    .catch(err => {logger.log(`Error creating post on admin`, err); throw new HttpsError('internal', err);});
  logger.log('post created on admin');

  await adminFirestore.collection(SharedCollectionPaths.BLOG_INDEX_REFS).doc(blogIndexRef[PostKeys.ID]).set(blogIndexRef)
    .catch(err => {logger.log(`Error creating blogIndexRef on admin`, err); throw new HttpsError('internal', err);});
  logger.log('blogIndexRef created on admin');
}

const executeActions = async (post: Post): Promise<Post> => {

  const currentTimestamp = Timestamp.now() as any;

  // Configure the post and blogIndexRef for creation
  const postWithTimestamps: Post = {
    ...post,
    [PostKeys.CREATED_TIMESTAMP]: currentTimestamp,
    [PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP]: null,
    [PostKeys.LAST_MODIFIED_TIMESTAMP]: currentTimestamp,
    [PostKeys.PUBLISHED_TIMESTAMP]: null,
    [PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP]: null
  };

  const blogIndexRefWithTimestamps: BlogIndexRef = convertPostToBlogIndexRef(postWithTimestamps);

  await createPostAndBlogIndexRefOnAdmin(postWithTimestamps, blogIndexRefWithTimestamps);

  return postWithTimestamps;
}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true,
};

export const onCallCreatePost = onCall(callableOptions, async (request: CallableRequest<Post>): Promise<Post> => {
  const postData = request.data;
  logger.log('onCallCreatePost requested with this data:', postData);

  const post = await executeActions(postData);

  return post;
});
