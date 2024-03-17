import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { adminFirestore } from "../config/db-config";
import { SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { currentEnvironmentType } from "../config/environments-config";
import { EnvironmentTypes, ProductionCloudStorage, SandboxCloudStorage } from "../../../shared-models/environments/env-vars.model";
import { adminStorage } from "../config/storage-config";
import { AdminCsDirectoryPaths } from "../../../shared-models/routes-and-paths/cs-directory-paths.model";
import { DeleteFilesOptions } from '@google-cloud/storage';

const adminBlogStorageBucket = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? 
  adminStorage.bucket(ProductionCloudStorage.EXPN_ADMIN_BLOG_STORAGE_NO_PREFIX) :
  adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_BLOG_STORAGE_NO_PREFIX);

// This should recursively delete anything in the provided dataDirectory
// This gracefully exits if directory doesn't exist so no need to check
// The prefix here is the directory to be queried; use a delimiter in the GetFilesOptions if you want to avoid files in sub directories
// See docs for more details on specificying a directory: https://cloud.google.com/storage/docs/listing-objects#storage-list-objects-nodejs
const deletePostImageData = async (postId: string) => {
  
  const dataDirectory = `${AdminCsDirectoryPaths.POST_IMAGES}/${postId}`; // Confirm this matches the path in the Image Uploader Component

  const getFilesOptions: DeleteFilesOptions = {
    prefix: dataDirectory,
  };
  await adminBlogStorageBucket.deleteFiles(getFilesOptions)
    .catch(err => {logger.log(`Failed to delete post files: `, err); throw new HttpsError('internal', err);});
  
  console.log(`Deleted files for post with id ${postId}`);
};

// Delete the post in the admin db
const deletePostAndBlogIndexRefOnAdmin = async (postId: string) => {
  await adminFirestore.collection(SharedCollectionPaths.POSTS).doc(postId).delete()
    .catch(err => {logger.log(`Error deleting post on admin`, err); throw new HttpsError('internal', err);});
  logger.log('post deleted on admin');

  await adminFirestore.collection(SharedCollectionPaths.BLOG_INDEX_REFS).doc(postId).delete()
    .catch(err => {logger.log(`Error deleting blogIndexRef on admin`, err); throw new HttpsError('internal', err);});
  logger.log('blogIndexRef deleted on admin');
}

const executeActions = async (postId: string) => {
  await deletePostAndBlogIndexRefOnAdmin(postId);
  await deletePostImageData(postId);
}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true,
};

export const onCallDeletePost = onCall(callableOptions, async (request: CallableRequest<string>) => {
  const postId = request.data;
  logger.log('onCallDeletePost requested with this data:', postId);

  const post = await executeActions(postId);

  return post;
});
