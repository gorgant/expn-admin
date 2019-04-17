import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getPublicApp } from '../public-app';

interface UsState {
  name: string;
  abbr: string;
  order: number;
}

export const updateUsStateList = functions.https.onCall(async (data: UsState[], context) => {
  const outcome = await updateList(data);
  return {outcome}
});


async function updateList(stateList: UsState[]) {

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

  console.log('About to set stateList', stateList);
  const fbRes = await publicFirestore.collection('publicResources').doc('stateData').set({stateList})
    .catch(error => console.log(error));
    console.log('States updated');
    return fbRes;
}
