import * as functions from 'firebase-functions';
import { SharedCollectionPaths, PublicCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths";
import { publicFirestore } from "../db";
import { Post } from "../../../shared-models/posts/post.model";
import { BlogIndexPostRef } from '../../../shared-models/posts/blog-index-post-ref.model';

const publicDb = publicFirestore;
const publicPostCollection = publicDb.collection(SharedCollectionPaths.POSTS);
const publicBlogIndexCollection = publicDb.collection(PublicCollectionPaths.BLOG_INDEX);

const deleteBlogIndex = async (): Promise<FirebaseFirestore.WriteResult[] | null> => {

  const blogIndexCollectionSnapshot: FirebaseFirestore.QuerySnapshot = await publicBlogIndexCollection.get()
    .catch(error => {throw new Error(`Error fetching public blog index collection: ${error}`)});

  const blogIndexArray = blogIndexCollectionSnapshot.docs;
  
  // Exit function if array is empty
  if (blogIndexArray.length < 1) {
    console.log('No post index items found, aborting delete');
    return null;
  }

  const batch = publicDb.batch();
  const maxBatchSize = 450; // Firebase limit is 500
  let batchSize = 0;

  console.log(`Initiating batch delete of post indexes, found ${blogIndexArray.length} index refs in the array`);

  // Loop through array until the max batch size is reached
  for (let i = 0; i < maxBatchSize; i++) {
    const docRef = blogIndexArray[i] ? blogIndexArray[i].ref : null;
    if (!docRef) {
      break;
    } 
    batch.delete(docRef);
    batchSize = i+1;
  }

  const batchDelete = await batch.commit()
    .catch(error => {throw new Error(`Error with batch delete: ${error}`)});

  console.log(`Batch deleted ${batchSize} index refs, should equal batch delete response length: ${batchDelete.length}`);

  // If more items than max batch size, re-run operation until that's not the case
  if (batchSize >= maxBatchSize) {
    console.log('Batch size exceeded limit, running function again');
    return deleteBlogIndex();
  }

  return batchDelete;
}

const createBlogIndex = async (): Promise<FirebaseFirestore.WriteResult[] | null> => {

  const publicPostCollectionSnapshot: FirebaseFirestore.QuerySnapshot = await publicPostCollection.get()
    .catch(error => {throw new Error(`Error fetching public post collection: ${error}`)});

  const postArray = publicPostCollectionSnapshot.docs;
  
  // Exit function if array is empty
  if (postArray.length < 1) {
    console.log('No post items found, aborting creation');
    return null;
  }

  const blogIndexArray: BlogIndexPostRef[] = postArray.map(doc => {
    const post: Post = doc.data() as Post;
    const postRef: BlogIndexPostRef = {
      title: post.title,
      published: post.published,
      publishedDate: post.publishedDate,
      imageProps: post.imageProps,
      id: post.id,
      featured: post.featured ? post.featured : false
    }
    return postRef;
  });

  const batch = publicDb.batch();
  const maxBatchSize = 450; // Firebase limit is 500
  let batchSize = 0;

  console.log(`Initiating batch creation of blog index, found ${blogIndexArray.length} post refs in the index`);

  // Loop through array until the max batch size is reached
  for (let i = 0; i < maxBatchSize; i++) {
    // Get the data to upload
    const postRef = blogIndexArray[i];
    if (!postRef) {
      break;
    }
    // Create a reference to the new doc using the post id
    const docRef = publicBlogIndexCollection.doc(postRef.id);
    batch.create(docRef, postRef);
    batchSize = i+1;
  }

  const batchCreate = await batch.commit()
    .catch(error => {throw new Error(`Error with batch creation: ${error}`)});

  console.log(`Batch created ${batchSize} index refs, should equal batch creation response length: ${batchCreate.length}`);

  // If more items than max batch size, re-run operation until that's not the case
  if (batchSize >= maxBatchSize) {
    console.log('Batch size exceeded limit, running function again');
    return createBlogIndex();
  }

  return batchCreate;
}

// const tempUpdateAdminPostBlogDomain = async (): Promise<FirebaseFirestore.WriteResult[] | null> => {
//   const adminDb = adminFirestore;
//   const adminPostCollection = adminDb.collection(SharedCollectionPaths.POSTS);
//   const adminPostCollectionSnapshot: FirebaseFirestore.QuerySnapshot = await adminPostCollection.get()
//     .catch(error => {throw new Error(`Error fetching admin post collection: ${error}`)});
//   const batch = adminDb.batch();

//   adminPostCollectionSnapshot.docs.forEach( async (doc) => {
//     const domainUpdate: Partial<Post> = { blogDomain: BlogDomains.EXPLEARNING };
//     batch.update(doc.ref, domainUpdate);
//   });

//   const batchUpdate = await batch.commit()
//     .catch(error => {throw new Error(`Error with batch update: ${error}`)});

//   console.log(`Batch updated ${batchUpdate.length} blog domains`);

//   return batchUpdate;
// }


/////// DEPLOYABLE FUNCTIONS ///////


export const refreshPublicBlogIndex = functions.https.onCall(async (data: any, context) => {
  console.log('Received request to refresh public blog index with this data', data);
  
  await deleteBlogIndex()
    .catch(error => {throw new Error(`Error deleting old public post index: ${error}`)});
  
  await createBlogIndex()
    .catch(error => {throw new Error(`Error creating new public post index: ${error}`)});

  // await tempUpdateAdminPostBlogDomain()
  //   .catch(error => {throw new Error(`Error updating admin post blog domain: ${error}`)});
  
  return;
});



