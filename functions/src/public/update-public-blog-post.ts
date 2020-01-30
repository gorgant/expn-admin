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
const blogSlugWithSlashPrefix = PublicAppRoutes.BLOG;

const generateBlogUrlObject = (): WebpageUrl => {
  const blogUrl: string = `https://${publicAppUrl}${blogSlugWithSlashPrefix}`;
  const urlObject: WebpageUrl = { url: blogUrl };
  return urlObject;
}

const generatePostUrlObject = (post: Post): WebpageUrl => {
  const postSlug: string = convertToFriendlyUrlFormat(post.title);
  const postUrl: string = `https://${publicAppUrl}${blogSlugWithSlashPrefix}/${post.id}/${postSlug}`;
  const urlObject: WebpageUrl = { url: postUrl };
  return urlObject;
}


const submitCacheUpdateRequest = async (urlObject: WebpageUrl) => {

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

    // Update post page cache
    const postUrlObject = generatePostUrlObject(post);
    const postCacheUpdateRes = await submitCacheUpdateRequest(postUrlObject)
      .catch((error: any) => console.log(error));
    console.log('Post cache update transmitted');

    // Update blog page cache (to include new post page)
    const blogUrlObject = generateBlogUrlObject();
    const blogCacheUpdateRes = await submitCacheUpdateRequest(blogUrlObject)
      .catch((error: any) => console.log(error));
    console.log('Blog cache update transmitted');

    return fbRes && postCacheUpdateRes && blogCacheUpdateRes;
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