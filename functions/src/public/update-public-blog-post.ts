import * as functions from 'firebase-functions';
import { Post } from '../../../shared-models/posts/post.model';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../db';

const publishPost = async (post: Post) => {

  const db = publicFirestore;
  console.log('Public firestore', db);

  // If post is published on admin, publish updates on public
  if (post.published) {
    const fbRes = await db.collection(SharedCollectionPaths.POSTS).doc(post.id).set(post)
      .catch(error => console.log(error));
    console.log('Post published');
    return fbRes;
  }

  // If post not published on admin, unpublish on public
  if (!post.published) {
    const fbRes = await db.collection(SharedCollectionPaths.POSTS).doc(post.id).delete()
      .catch(error => console.log(error));
    console.log('Post unpublished');
    return fbRes;
  }

}

/////// DEPLOYABLE FUNCTIONS ///////

export const updatePublicBlogPost = functions.https.onCall(async (data: Post, context) => {
  console.log('Updating public post with this data', data);
  const outcome = await publishPost(data);
  return {outcome}
});