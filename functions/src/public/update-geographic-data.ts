import * as functions from 'firebase-functions';
import { GeographicData } from '../../../shared-models/forms-and-components/geography/geographic-data.model';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../config/db-config';
import { assertUID } from '../config/global-helpers';

const updateGeoLists = async (geographicData: GeographicData) => {
  const db = publicFirestore;
  const fbRes = await db.collection(SharedCollectionPaths.PUBLIC_RESOURCES).doc(SharedCollectionPaths.GEOGRAPHIC_DATA).set(geographicData)
    .catch(err => {console.log(`Failed to update geographic data in public database`, err); throw new functions.https.HttpsError('internal', err);});
  console.log('Geographic data updated in public database:', fbRes);
  return fbRes;
}

/////// DEPLOYABLE FUNCTIONS ///////

export const updateGeographicData = functions.https.onCall(async (data: GeographicData, context) => {

  console.log('Received request to update geographic data on public database with this data', data);
  assertUID(context);
  
  return updateGeoLists(data);
});
