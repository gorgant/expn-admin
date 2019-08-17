import * as functions from 'firebase-functions';
import { PubSub } from '@google-cloud/pubsub';
import { Post } from '../../../shared-models/posts/post.model';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../db';
import { PublicAppRoutes } from '../../../shared-models/routes-and-paths/app-routes.model';
import { convertToFriendlyUrlFormat } from './helpers';
import { WebpageUrl } from '../../../shared-models/ssr/webpage-url.model';
import { publicProjectId, publicAppUrl } from '../environments/config';
import { PublicFunctionNames } from '../../../shared-models/routes-and-paths/fb-function-names';

const pubSub = new PubSub();

const updatePostCache = async (post: Post) => {

  const blogSlugWithSlashPrefix = PublicAppRoutes.BLOG;
  const postSlug: string = convertToFriendlyUrlFormat(post.title);
  const postUrl: string = `https://${publicAppUrl}${blogSlugWithSlashPrefix}/${post.id}/${postSlug}`;

  const urlObject: WebpageUrl = { url: postUrl };
  console.log('Commencing url trasmission based on this data', urlObject);

  const publicProject = publicProjectId;
  console.log('Publishing to this project topic', publicProject);

  // Target topic in the PubSub (must add this project's service account to target project)
  const topic = pubSub.topic(`projects/${publicProject}/topics/${PublicFunctionNames.SAVE_WEBPAGE_TO_CACHE_TOPIC}`);

  const topicPublishRes = await topic.publishJSON(urlObject)
    .catch(err => {
      console.log('Publish to topic failed', err);
      return err;
    });
  console.log('Res from topic publish', topicPublishRes);

  return topicPublishRes;
}

export const publishPostOnPublic = async (post: Post) => {

  const db: FirebaseFirestore.Firestore = publicFirestore;

  // If post is published on admin, publish updates on public and update cache
  if (post.published) {
    const fbRes = await db.collection(SharedCollectionPaths.POSTS).doc(post.id as string).set(post)
      .catch((error: any) => console.log(error));
    console.log('Post published');
    
    const cacheUpdateRes = await updatePostCache(post)
      .catch((error: any) => console.log(error));
    console.log('Cache update transmitted');

    return fbRes && cacheUpdateRes;
  }

  // If post not published on admin, unpublish on public
  if (!post.published) {
    const fbRes = await db.collection(SharedCollectionPaths.POSTS).doc(post.id as string).delete()
      .catch((error: any) => console.log(error));
    console.log('Post unpublished');
    return fbRes;
  }

}

/////// DEPLOYABLE FUNCTIONS ///////

export const updatePublicBlogPost = functions.https.onCall(async (data: Post, context) => {
  console.log('Updating public post with this data', data);
  const outcome = await publishPostOnPublic(data);
  return {outcome}
});