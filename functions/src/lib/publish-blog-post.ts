import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getPublicApp } from '../public-app';

interface Post {
  title: string;
  author: string;
  authorId: string;
  content: string;
  modifiedDate: number;
  published?: boolean;
  publishedDate?: number;
  heroImageProps?: any;
  id?: string;
  imagesUpdated?: Date;
  imageSizes?: number[];
  imageFilePathList?: string[];
  videoUrl?: string;
}

export const publishBlogPost = functions.https.onCall(async (data: Post, context) => {
  const outcome = await publishPost(data);
  return {outcome}
});


async function publishPost(post: Post) {

  let publicApp: admin.app.App;

  // Get list of initialized apps
  const appList = admin.apps;

  // Identify if the app array includes public app
  const filteredArray = appList.filter(app => {
    const appName = app!['name']; // Exclamation mark ensures no null see: https://stackoverflow.com/a/40350534/6572208
    return appName === 'public';
  })

  console.log('Current app list (pre custom init)', appList);

  // Ensure only one version of the public app is initialized
  if (filteredArray.length === 0) {
    console.log('No public app available, instantiating now');
    publicApp = await getPublicApp();
  } else {
    console.log('Public app already instantiated, using that');
    publicApp = admin.app('public');
  }


  const publicFirestore = publicApp.firestore();


  // If post is published on admin, publish here
  if (post.published) {
    const fbRes = await publicFirestore.collection('posts').doc(post.id).set(post)
      .catch(error => console.log(error));
    console.log('Post published');
    return fbRes;
  }

  // If post not published on admin, unpublish here
  if (!post.published) {
    const fbRes = await publicFirestore.collection('posts').doc(post.id).delete()
      .catch(error => console.log(error));
    console.log('Post unpublished');
    return fbRes;
  }

}
