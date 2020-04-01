import * as functions from 'firebase-functions';
import { SharedCollectionPaths, PublicCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths";
import { publicFirestore } from "../config/db-config";
import { Post, BlogIndexPostRef } from "../../../shared-models/posts/post.model";
import { assertUID } from '../config/global-helpers';

const publicDb = publicFirestore;
const publicPostCollection = publicDb.collection(SharedCollectionPaths.POSTS);
const publicBlogIndexCollection = publicDb.collection(PublicCollectionPaths.BLOG_INDEX);

const deleteBlogIndex = async (): Promise<FirebaseFirestore.WriteResult[] | null> => {

  const blogIndexCollectionSnapshot: FirebaseFirestore.QuerySnapshot = await publicBlogIndexCollection.get()
    .catch(err => {console.log(`Error fetching public blog index collection:`, err); throw new functions.https.HttpsError('internal', err);});
    
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
    .catch(err => {console.log(`Error with batch delete:`, err); throw new functions.https.HttpsError('internal', err);});

  console.log(`Batch deleted ${batchSize} index refs, should equal batch delete response length: ${batchDelete.length}`);

  // If more items than max batch size, re-run operation until that's not the case
  if (batchSize >= maxBatchSize) {
    console.log('Batch size exceeded limit, running function again');
    return deleteBlogIndex();
  }

  return batchDelete;
}

let itemsProcessedCount = 0;
let loopCount = 0; 
const batchSetBlogIndex = async(blogIndexArray: BlogIndexPostRef[]) => {
  
  const itemsRemaining = blogIndexArray.slice(itemsProcessedCount);
  
  const batch = publicDb.batch();
  const maxBatchSize = 450; // Firebase limit is 500
  let batchSize = 0;

  // Loop through array until the max batch size is reached
  for (let i = 0; i < maxBatchSize; i++) {
    // Get the data to upload
    const postRef = itemsRemaining[i];
    if (!postRef) {
      break; // Abort loop if end of array reached before batch limit is hit
    }
    // Create a reference to the new doc using the post id
    const docRef = publicBlogIndexCollection.doc(postRef.id);
    batch.set(docRef, postRef);
    batchSize = i + 1;
  }

  const batchCreate = await batch.commit()
    .catch(err => {console.log(`Error with batch creation:`, err); throw new functions.https.HttpsError('internal', err);});
    

  console.log(`Batch created ${batchCreate.length} items`);
  itemsProcessedCount += batchSize; // Update global variable to keep track of remaining episodes to cache
  loopCount++; // Prevents infinite looping in case of error
}

const createBlogIndex = async () => {

  itemsProcessedCount = 0; // Initialize at zero (prevents global variable remenant from last function execution)
  loopCount = 0; // Initialize at zero (prevents global variable remenant from last function execution)

  const publicPostCollectionSnapshot: FirebaseFirestore.QuerySnapshot = await publicPostCollection.get()
    .catch(err => {console.log(`Error fetching public post collection:`, err); throw new functions.https.HttpsError('internal', err);});

  const postArray = publicPostCollectionSnapshot.docs;
  
  // Exit function if array is empty
  if (postArray.length < 1) {
    console.log('No post items found, aborting creation');
    return;
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

  // Cache each episode inside the podcast container
  const totalItemCount = blogIndexArray.length;
  while (itemsProcessedCount < totalItemCount && loopCount < 10) {
    await batchSetBlogIndex(blogIndexArray);
    if (itemsProcessedCount < totalItemCount) {
      console.log(`Repeating batch process: ${itemsProcessedCount} out of ${totalItemCount} items cached`);
    }
  }
}

// const tempUpdateAdminPostBlogDomain = async (): Promise<FirebaseFirestore.WriteResult[] | null> => {

//   // IF YOU RUN THIS AGAIN, UPDATE TO MATCH PATTERN IN CREATEBLOGINDEX ABOVE!!!!

//   const adminDb = adminFirestore;
//   const adminPostCollection = adminDb.collection(SharedCollectionPaths.POSTS);
//   const adminPostCollectionSnapshot: FirebaseFirestore.QuerySnapshot = await adminPostCollection.get()
//     .catch(err => {console.log(`Error fetching admin post collection:`, err); throw new functions.https.HttpsError('internal', err);});
//   const batch = adminDb.batch();

//   adminPostCollectionSnapshot.docs.forEach( async (doc) => {
//     const domainUpdate: Partial<Post> = { blogDomain: BlogDomains.EXPLEARNING };
//     batch.update(doc.ref, domainUpdate);
//   });

//   const batchUpdate = await batch.commit()
//     .catch(err => {console.log(`Error with batch update:`, err); throw new functions.https.HttpsError('internal', err);});

//   console.log(`Batch updated ${batchUpdate.length} blog domains`);

//   return batchUpdate;
// }

const executeActions = async () => {
  await deleteBlogIndex();

  await createBlogIndex();

  // await tempUpdateAdminPostBlogDomain();
}

/////// DEPLOYABLE FUNCTIONS ///////


export const refreshPublicBlogIndex = functions.https.onCall(async (data: any, context) => {
  console.log('Received request to refresh public blog index with this data', data);

  assertUID(context);
  
  return executeActions();
});



