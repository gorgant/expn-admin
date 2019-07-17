import * as functions from 'firebase-functions';
import { Post } from '../../../shared-models/posts/post.model';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { explearningPublicFirestore, maryDaphnePublicFirestore } from '../db';
import { BlogDomains } from '../../../shared-models/posts/blog-domains.model';

const publishPost = async (post: Post) => {

  let db: FirebaseFirestore.Firestore = explearningPublicFirestore;

  // Switch to Mary Daphne firestore if flagged
  if (post.blogDomain === BlogDomains.MARY_DAPHNE) {
    db = maryDaphnePublicFirestore;
  }
  console.log('Public firestore', db);

  // If post is published on admin, publish updates on public
  if (post.published) {
    const fbRes = await db.collection(SharedCollectionPaths.POSTS).doc(post.id as string).set(post)
      .catch((error: any) => console.log(error));
    console.log('Post published');
    return fbRes;
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
  const outcome = await publishPost(data);
  return {outcome}
});