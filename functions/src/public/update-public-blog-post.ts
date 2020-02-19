import * as functions from 'firebase-functions';
import { Post } from '../../../shared-models/posts/post.model';
import { SharedCollectionPaths, PublicCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../db';
import { BlogIndexPostRef } from '../../../shared-models/posts/blog-index-post-ref.model';
import { submitCacheUpdateRequest } from './submit-cache-update-request';
import { generatePostUrlObject, generateBlogUrlObject, generateHomeUrlObject } from './helpers';


const publicDb: FirebaseFirestore.Firestore = publicFirestore;

const publishPost = async (post: Post) => {
  const fbRes = await publicDb.collection(SharedCollectionPaths.POSTS).doc(post.id).set(post)
    .catch((error: any) => {throw new Error(`Error publishing post: ${error}`)});
  console.log('Post published');

  return fbRes;
}

const deletePost = async (post: Post) => {
  const fbRes = await publicDb.collection(SharedCollectionPaths.POSTS).doc(post.id).delete()
    .catch((error: any) => {throw new Error(`Error deleting post: ${error}`)});
  console.log('Post unpublished');
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
    .catch((error: any) => {throw new Error(`Error publishing post index ref: ${error}`)});
  console.log('Post published');

  return fbRes;
}

const deleteBlogIndexPostRef = async (post: Post) => {
  const fbRes = await publicDb.collection(PublicCollectionPaths.BLOG_INDEX).doc(post.id).delete()
    .catch((error: any) => {throw new Error(`Error deleting post index ref: ${error}`)});
  console.log('Post index deleted');
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
    postFbRes = await deletePost(post)
      .catch ((error: any) => {throw new Error(`Error deleting post ${post}: ${error}`)});
    postRefFbRes = await deleteBlogIndexPostRef(post)
      .catch ((error: any) => {throw new Error(`Error deleting postRef for ${post}: ${error}`)});
    blogCacheUpdateRes = await submitCacheUpdateRequest(blogUrlObject)
      .catch ((error: any) => {throw new Error(`Error submitting blog cache update request: ${error}`)});
    console.log('Blog cache update transmitted');
    featuredPostsCacheUpdateRes = await submitCacheUpdateRequest(homeUrlObject)
      .catch ((error: any) => {throw new Error(`Error submitting featured posts cache update request: ${error}`)});
    console.log('Home cache update transmitted');
    return postFbRes && postRefFbRes && blogCacheUpdateRes;
  }

  // Publish post
  postFbRes = await publishPost(post)
    .catch ((error: any) => {throw new Error(`Error publishing post: ${error}`)});

  // Publish post index ref
  postRefFbRes = await publishPostRef(post)
    .catch ((error: any) => {throw new Error(`Error publishing postRef: ${error}`)});

  // Update post page cache
  postCacheUpdateRes = await submitCacheUpdateRequest(postUrlObject)
    .catch ((error: any) => {throw new Error(`Error submitting post cache update request: ${error}`)});
  console.log('Post cache update transmitted');

  // Update blog page cache (to include new post page)
  blogCacheUpdateRes = await submitCacheUpdateRequest(blogUrlObject)
    .catch ((error: any) => {throw new Error(`Error submitting blog cache update request: ${error}`)});
  console.log('Blog cache update transmitted');

  // Update featured posts cache (i.e., home page cache)
  featuredPostsCacheUpdateRes = await submitCacheUpdateRequest(homeUrlObject)
    .catch ((error: any) => {throw new Error(`Error submitting home cache update request: ${error}`)});
  console.log('Home cache update transmitted');

  return postFbRes && postRefFbRes && postCacheUpdateRes && blogCacheUpdateRes && featuredPostsCacheUpdateRes;
}

/////// DEPLOYABLE FUNCTIONS ///////

export const updatePublicBlogPost = functions.https.onCall(async (data: Post, context) => {
  console.log('Updating public post with this data', data);
  const outcome = await updatePostOnPublic(data);
  return {outcome}
});