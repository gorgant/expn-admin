import * as functions from 'firebase-functions';
import { SharedCollectionPaths, PublicCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths";
import { publicFirestore } from "../db";
import { Post } from "../../../shared-models/posts/post.model";
import { BlogIndexPostRef } from '../../../shared-models/posts/blog-index-post-ref.model';

const publicDb = publicFirestore;
const blogIndexCollection = publicDb.collection(PublicCollectionPaths.BLOG_INDEX);

const deleteBlogIndex = async (): Promise<FirebaseFirestore.WriteResult[] | null> => {

  console.log(`Initiating batch delete of post index`);

  const blogIndexCollectionSnapshot: FirebaseFirestore.QuerySnapshot = await blogIndexCollection.get()
    .catch(error => {throw new Error(`Error fetching post index collection: ${error}`)});

  const blogIndexArray = blogIndexCollectionSnapshot.docs;
  
  // Exit function if array is empty
  if (blogIndexArray.length < 1) {
    console.log('No post index items found, aborting delete');
    return null;
  }

  const batch = publicDb.batch();
  const maxBatchSize = 450; // Firebase limit is 500
  let batchSize = 0;

  console.log(`Initiating batch delet of post index, found ${blogIndexArray.length} index refs in the array`);

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

const createBlogIndex = async () => {

  const postCollectionSnapshot: FirebaseFirestore.QuerySnapshot = await publicDb.collection(SharedCollectionPaths.POSTS).get()
    .catch(error => {throw new Error(`Error fetching post collection: ${error}`)});

  const blogIndexArray: BlogIndexPostRef[] = postCollectionSnapshot.docs.map(doc => {
    const post: Post = doc.data() as Post;
    const postRef: BlogIndexPostRef = {
      title: post.title,
      published: post.published,
      publishedDate: post.publishedDate,
      imageProps: post.imageProps,
      id: post.id
    }
    return postRef;
  });

  const blogIndexUploadPromise = blogIndexArray.map( async (postRef: BlogIndexPostRef) => {
    const fbRes = await blogIndexCollection.doc(postRef.id as string).set(postRef)
      .catch((error: any) => {throw new Error(`Error creating post index ref: ${error}`)});
    console.log('Post index ref created');
    return fbRes;
  })

  await Promise.all(blogIndexUploadPromise)
    .catch(error => {throw new Error(`Error in group promise while uploading post index: ${error}`)});

  console.log(`Created Post Index with ${blogIndexArray.length} entries`);
}


/////// DEPLOYABLE FUNCTIONS ///////


export const refreshPublicBlogIndex = functions.https.onCall(async (data: any, context) => {
  console.log('Received request to refresh public blog index with this data', data);
  
  await deleteBlogIndex()
    .catch(error => {throw new Error(`Error deleting old post index: ${error}`)});
  
  await createBlogIndex()
    .catch(error => {throw new Error(`Error creating new post index: ${error}`)});
  
  return;
});



