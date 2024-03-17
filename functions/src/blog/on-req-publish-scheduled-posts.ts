import { HttpsError, HttpsOptions, onRequest } from "firebase-functions/v2/https";
import { SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";
import { cloudSchedulerServiceAccountSecret } from "../config/api-key-config";
import { validateRequestToken } from "../config/global-helpers";
import { Post, PostKeys } from "../../../shared-models/posts/post.model";
import { Timestamp } from '@google-cloud/firestore';
import { SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { logger } from "firebase-functions/v2";
import { adminFirestore } from "../config/db-config";
import { publishPostOnAdminAndPublic } from "./on-call-publish-post";

const publishExpiredPosts = async () => {
  // Fetch all unpublished posts
  const postCollectionSnapshot: FirebaseFirestore.QuerySnapshot = await adminFirestore.collection(SharedCollectionPaths.POSTS)
    .where('published', '==', false)
    .get()
    .catch(err => {logger.log(`Error fetching post collection:`, err); throw new HttpsError('internal', err);});

  // Scan for and publish outstanding publish requests
  for (const doc of postCollectionSnapshot.docs) {
    const post: Post = doc.data() as Post;

    const scheduledPublishTime = post[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP] || null;

    // Confirm that publish time is prior to current time
    if (scheduledPublishTime && scheduledPublishTime < Timestamp.now()) {
      logger.log(`expired publish request detected`, post);
      await publishPostOnAdminAndPublic(post);
    }
  }
}

/////// DEPLOYABLE FUNCTIONS ///////

const httpOptions: HttpsOptions = {
  secrets: [
    SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS, 
    SecretsManagerKeyNames.CLOUD_SCHEDULER_SERVICE_ACCOUNT_EMAIL
  ],
};

export const onReqPublishScheduledPosts = onRequest(httpOptions, async (req, res) => {

  logger.log('onReqPublishScheduledPosts detected with these headers', req.headers);

  const expectedAudience = cloudSchedulerServiceAccountSecret.value();
  
  const isValid = await validateRequestToken(req, res, expectedAudience);
  
  if (!isValid) {
    logger.log('Request verification failed, terminating function');
    return;
  }

  await publishExpiredPosts();

  res.status(200).send('onReqPublishScheduledPosts succeeded!');

});