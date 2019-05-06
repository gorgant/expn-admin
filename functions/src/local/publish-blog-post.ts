import * as functions from 'firebase-functions';
import { getPublicApp } from '../public-app';
import { Post } from '../../../shared-models/posts/post.model';
import { FbCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';

export const publishBlogPost = functions.https.onCall(async (data: Post, context) => {
  const outcome = await publishPost(data);
  return {outcome}
});


async function publishPost(post: Post) {

  const publicApp = await getPublicApp();


  const publicFirestore = publicApp.firestore();


  // If post is published on admin, publish here
  if (post.published) {
    const fbRes = await publicFirestore.collection(FbCollectionPaths.POSTS).doc(post.id).set(post)
      .catch(error => console.log(error));
    console.log('Post published');
    return fbRes;
  }

  // If post not published on admin, unpublish here
  if (!post.published) {
    const fbRes = await publicFirestore.collection(FbCollectionPaths.POSTS).doc(post.id).delete()
      .catch(error => console.log(error));
    console.log('Post unpublished');
    return fbRes;
  }

}
