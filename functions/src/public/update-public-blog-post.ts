import * as functions from 'firebase-functions';
import { Post } from '../../../shared-models/posts/post.model';
import { SharedCollectionPaths, PublicCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../db';
import { BlogIndexPostRef } from '../../../shared-models/posts/blog-index-post-ref.model';
import { submitCacheUpdateRequest } from './submit-cache-update-request';
import { generatePostUrlObject, generateBlogUrlObject } from './helpers';


const publicDb: FirebaseFirestore.Firestore = publicFirestore;

const publishPost = async (post: Post) => {
  const fbRes = await publicDb.collection(SharedCollectionPaths.POSTS).doc(post.id as string).set(post)
    .catch((error: any) => {throw new Error(`Error publishing post: ${error}`)});
  console.log('Post published');

  return fbRes;
}

const deletePost = async (post: Post) => {
  const fbRes = await publicDb.collection(SharedCollectionPaths.POSTS).doc(post.id as string).delete()
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
    id: post.id
  }

  const fbRes = await publicDb.collection(PublicCollectionPaths.BLOG_INDEX).doc(post.id as string).set(postRef)
    .catch((error: any) => {throw new Error(`Error publishing post index ref: ${error}`)});
  console.log('Post published');

  return fbRes;
}

const deletePostRef = async (post: Post) => {
  const fbRes = await publicDb.collection(PublicCollectionPaths.BLOG_INDEX).doc(post.id as string).delete()
    .catch((error: any) => {throw new Error(`Error deleting post index ref: ${error}`)});
  console.log('Post index deleted');
  return fbRes;
}


// Publish updates on public and update cache
export const updatePostOnPublic = async (post: Post) => {

  const postUrlObject = generatePostUrlObject(post);
  const blogUrlObject = generateBlogUrlObject();
  let postFbRes;
  let postRefFbRes;
  let postCacheUpdateRes;
  let blogCacheUpdateRes;

  // If post not published on admin, unpublish on public and update cache
  if (!post.published) {
    postFbRes = await deletePost(post)
      .catch ((error: any) => {throw new Error(`Error deleting post ${post}: ${error}`)});
    postRefFbRes = await deletePostRef(post)
      .catch ((error: any) => {throw new Error(`Error deleting postRef for ${post}: ${error}`)});
    blogCacheUpdateRes = await submitCacheUpdateRequest(blogUrlObject)
      .catch ((error: any) => {throw new Error(`Error submitting blog cache update request: ${error}`)});
    console.log('Blog cache update transmitted');
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

  return postFbRes && postRefFbRes && postCacheUpdateRes && blogCacheUpdateRes;
}

/////// DEPLOYABLE FUNCTIONS ///////

export const updatePublicBlogPost = functions.https.onCall(async (data: Post, context) => {
  console.log('Updating public post with this data', data);
  const outcome = await updatePostOnPublic(data);
  return {outcome}
});