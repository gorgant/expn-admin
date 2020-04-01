import * as functions from 'firebase-functions';
import { Post, BlogIndexPostRef } from '../../../shared-models/posts/post.model';
import { SharedCollectionPaths, PublicCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../config/db-config';
import { submitCacheUpdateRequest } from './submit-cache-update-request';
import { generatePostUrlObject, generateBlogUrlObject, generateHomeUrlObject } from './helpers';
import { assertUID } from '../config/global-helpers';


const publicDb: FirebaseFirestore.Firestore = publicFirestore;

const publishPost = async (post: Post) => {
  const fbRes = await publicDb.collection(SharedCollectionPaths.POSTS).doc(post.id).set(post)
    .catch(err => {console.log(`Failed to publish post on public database:`, err); throw new functions.https.HttpsError('internal', err);});
  console.log('Post published on public database:', fbRes);

  return fbRes;
}

const deletePost = async (post: Post) => {
  const fbRes = await publicDb.collection(SharedCollectionPaths.POSTS).doc(post.id).delete()
    .catch(err => {console.log(`Failed to delete post on public database:`, err); throw new functions.https.HttpsError('internal', err);});
  console.log('Post deleted on public database:', fbRes);
  return fbRes;
}

const publishPostRef = async (post: Post) => {
  const postRef: BlogIndexPostRef = {
    title: post.title,
    published: post.published,
    publishedDate: post.publishedDate,
    imageProps: post.imageProps,
    id: post.id,
    featured: post.featured ? post.featured : false
  }

  const fbRes = await publicDb.collection(PublicCollectionPaths.BLOG_INDEX).doc(post.id).set(postRef)
    .catch(err => {console.log(`Failed to publish blog index post ref on public database:`, err); throw new functions.https.HttpsError('internal', err);});
  console.log('Blog index post ref published on public database:', fbRes);

  return fbRes;
}

const deleteBlogIndexPostRef = async (post: Post) => {
  const fbRes = await publicDb.collection(PublicCollectionPaths.BLOG_INDEX).doc(post.id).delete()
    .catch(err => {console.log(`Failed to delete blog index post ref on public database:`, err); throw new functions.https.HttpsError('internal', err);});
  console.log('Blog index post ref deleted on public database:', fbRes);
  return fbRes;
}


// Publish updates on public and update cache
export const updatePostOnPublic = async (post: Post) => {

  const isDeletionRequest = !post.published;
  const postUrlObject = generatePostUrlObject(post);
  const blogUrlObject = generateBlogUrlObject();
  const homeUrlObject = generateHomeUrlObject();
  let postFbRes;
  let postRefFbRes;
  let postCacheUpdateRes;
  let blogCacheUpdateRes;
  let featuredPostsCacheUpdateRes;

  // Unpublish on public and update cache
  if (isDeletionRequest) {
    postFbRes = await deletePost(post);
    postRefFbRes = await deleteBlogIndexPostRef(post);
    blogCacheUpdateRes = await submitCacheUpdateRequest(blogUrlObject);
    console.log('Blog cache update transmitted');
    featuredPostsCacheUpdateRes = await submitCacheUpdateRequest(homeUrlObject);
    console.log('Home cache update transmitted');
    return postFbRes && postRefFbRes && blogCacheUpdateRes;
  }

  // Publish post
  postFbRes = await publishPost(post);

  // Publish post index ref
  postRefFbRes = await publishPostRef(post);

  // Update post page cache
  postCacheUpdateRes = await submitCacheUpdateRequest(postUrlObject);
  console.log('Post cache update transmitted');

  // Update blog page cache (to include new post page)
  blogCacheUpdateRes = await submitCacheUpdateRequest(blogUrlObject);
  console.log('Blog cache update transmitted');

  // Update featured posts cache (i.e., home page cache)
  featuredPostsCacheUpdateRes = await submitCacheUpdateRequest(homeUrlObject);
  console.log('Home cache update transmitted');

  return postFbRes && postRefFbRes && postCacheUpdateRes && blogCacheUpdateRes && featuredPostsCacheUpdateRes;
}

/////// DEPLOYABLE FUNCTIONS ///////

export const updatePublicBlogPost = functions.https.onCall(async (data: Post, context) => {

  console.log('Received request to update blog post on public database with this data', data);
  assertUID(context);

  const post: Post = data;
  console.log('Updating public post with this data', post);
  
  return updatePostOnPublic(post);
});