import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { PostBoilerplate, PostBoilerplateKeys } from "../../../shared-models/posts/post-boilerplate.model";
import { logger } from "firebase-functions/v2";
import { convertMillisToTimestamp } from "../config/global-helpers";
import { Timestamp } from '@google-cloud/firestore';
import { adminFirestore, getPublicFirestoreWithAdminCreds } from "../config/db-config";
import { SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";

// Update the postBoilerplate in the admin db
const updatePostBoilerplateOnAdmin = async (postBoilerplate: PostBoilerplate) => {
  await adminFirestore.collection(SharedCollectionPaths.SHARED_RESOURCES).doc(postBoilerplate[PostBoilerplateKeys.ID]).set(postBoilerplate, {merge: true})
    .catch(err => {logger.log(`Error updating postBoilerplate on admin`, err); throw new HttpsError('internal', err);});
  logger.log('postBoilerplate updated on admin');
}

// Update the postBoilerplate in the public db
const updatePostBoilerplateOnPublic = async (postBoilerplate: PostBoilerplate) => {
  const publicFirestoreWithAdminCreds = getPublicFirestoreWithAdminCreds();
  await publicFirestoreWithAdminCreds.collection(SharedCollectionPaths.SHARED_RESOURCES).doc(postBoilerplate[PostBoilerplateKeys.ID]).set(postBoilerplate, {merge: true})
    .catch(err => {logger.log(`Error updating postBoilerplate on public`, err); throw new HttpsError('internal', err);});
  logger.log('postBoilerplate updated on public');
}

const executeActions = async (postBoilerplate: PostBoilerplate): Promise<PostBoilerplate> => {
  const currentTimestamp = Timestamp.now() as any;

  // Configure the postBoilerplate and blogIndexRef for creation
  const postBoilerplateWithTimestamps: PostBoilerplate = {
    ...postBoilerplate,
    [PostBoilerplateKeys.CREATED_TIMESTAMP]: convertMillisToTimestamp(postBoilerplate[PostBoilerplateKeys.CREATED_TIMESTAMP] as number) as any,
    [PostBoilerplateKeys.LAST_MODIFIED_TIMESTAMP]: currentTimestamp,
  };

  await updatePostBoilerplateOnPublic(postBoilerplateWithTimestamps);
  await updatePostBoilerplateOnAdmin(postBoilerplateWithTimestamps);

  return postBoilerplateWithTimestamps;
}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true,
  secrets: [SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS]
};

export const onCallUpdatePostBoilerplate = onCall(callableOptions, async (request: CallableRequest<PostBoilerplate>): Promise<PostBoilerplate> => {
  const postBoilerplateData = request.data;
  logger.log('onCallUpdatePostBoilerplate requested with this data:', postBoilerplateData);

  const postBoilerplate = await executeActions(postBoilerplateData);

  return postBoilerplate;
});
