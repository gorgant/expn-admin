import * as functions from 'firebase-functions';
import { GeographicData } from '../../../shared-models/forms-and-components/geography/geographic-data.model';
import { FbCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../db';

export const updateGeographicData = functions.https.onCall(async (data: GeographicData, context) => {
  const outcome = await updateGeoLists(data);
  return {outcome}
});


async function updateGeoLists(geographicData: GeographicData) {

  const db = publicFirestore;

  console.log('About to set geographic data', geographicData);
  const fbRes = await db.collection(FbCollectionPaths.PUBLIC_RESOURCES).doc('geographicData').set(geographicData)
    .catch(error => console.log(error));
    console.log('Geographic data updated');
    return fbRes;
}