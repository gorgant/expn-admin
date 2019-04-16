import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getPublicApp } from '../public-app';

interface Country {
  name: string;
  code: string;
  order: number;
}

export const updateCountryList = functions.https.onCall(async (data: Country[], context) => {
  const outcome = await updateList(data);
  return {outcome}
});


async function updateList(countryList: Country[]) {

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

  console.log('About to set countryList', countryList);
  const fbRes = await publicFirestore.collection('publicResources').doc('countryData').set({countryList})
    .catch(error => console.log(error));
    console.log('Countries updated');
    return fbRes;
}
