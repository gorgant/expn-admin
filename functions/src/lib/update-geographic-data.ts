import * as functions from 'firebase-functions';
import { getPublicApp } from '../public-app';

import { GeographicData } from '../../../shared-models/forms-and-components/geography/geographic-data.model';

export const updateGeographicData = functions.https.onCall(async (data: GeographicData, context) => {
  const outcome = await updateGeoLists(data);
  return {outcome}
});


async function updateGeoLists(geographicData: GeographicData) {

  const publicApp = await getPublicApp();

  const publicFirestore = publicApp.firestore();

  console.log('About to set geographic data', geographicData);
  const fbRes = await publicFirestore.collection('publicResources').doc('geographicData').set(geographicData)
    .catch(error => console.log(error));
    console.log('Geographic data updated');
    return fbRes;
}
