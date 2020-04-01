import * as functions from 'firebase-functions';
import { adminFirestore } from '../config/db-config';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { Post } from '../../../shared-models/posts/post.model';
import { now } from 'moment';
import { updatePostOnPublic } from '../public/update-public-blog-post';

const adminDb = adminFirestore;

// Update the post in the admin db
const publishPostOnAdmin = async (post: Post) => {
  // Configure the post for publish
  const updatedPost: Post = {
    ...post,
    published: true,
    publishedDate: post.publishedDate ? post.publishedDate : now(), // Only add publish date if doesn't already exist
    scheduledPublishTime: null // Clear the scheduled time when published so it doesn't trigger unwanted publish requests
  };

  const fbRes = await adminDb.collection(SharedCollectionPaths.POSTS).doc(updatedPost.id).set(updatedPost)
    .catch(err => {console.log(`Error updating post on admin`, err); throw new functions.https.HttpsError('internal', err);});
  console.log('Post published');

  return fbRes && updatedPost;
}

const publishExpiredPosts = async () => {
  
  // Fetch all unpublished posts
  const postCollectionSnapshot: FirebaseFirestore.QuerySnapshot = await adminDb.collection(SharedCollectionPaths.POSTS)
    .where('published', '==', false)
    .get()
    .catch(err => {console.log(`Error fetching post collection:`, err); throw new functions.https.HttpsError('internal', err);});

  // Scan for and publish outstanding publish requests
  for (const doc of postCollectionSnapshot.docs) {
    const post: Post = doc.data() as Post;

    const scheduledPublishTime = post.scheduledPublishTime || null;

    // Confirm that publish time is prior to current time
    if (scheduledPublishTime && scheduledPublishTime < now()) {
      console.log(`expired publish request detected`, post);

      // First update post on admin
      const updatedAdminPost: Post = await publishPostOnAdmin(post);

      // Then update post on public
      await updatePostOnPublic(updatedAdminPost);
    }
  }
}

/////// DEPLOYABLE FUNCTIONS ///////

// A cron job triggers this function
export const autoPublishBlogPosts = functions.https.onRequest( async (req, res ) => {
  console.log('Auto-publish blog posts request received with these headers', req.headers);

  if (req.headers['user-agent'] !== 'Google-Cloud-Scheduler') {
    console.log('Invalid request, ending operation');
    return;
  }

  await publishExpiredPosts();

  console.log('All expired posts published', res);
  return res.status(200).send('All expired posts published');
})