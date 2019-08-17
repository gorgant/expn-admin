import * as functions from 'firebase-functions';
import { GeographicData } from '../../../shared-models/forms-and-components/geography/geographic-data.model';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../db';



const updateGeoLists = async (geographicData: GeographicData) => {

  const db = publicFirestore;

  console.log('About to set geographic data', geographicData);
  const fbRes = await db.collection(SharedCollectionPaths.PUBLIC_RESOURCES).doc('geographicData').set(geographicData)
    .catch(error => console.log(error));
    console.log('Geographic data updated');
    return fbRes;
}

/////// DEPLOYABLE FUNCTIONS ///////

export const updateGeographicData = functions.https.onCall(async (data: GeographicData, context) => {
  const outcome = await updateGeoLists(data);
  return {outcome}
});
