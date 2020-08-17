import * as functions from 'firebase-functions';
import { Product } from '../../../shared-models/products/product.model';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { altEnvAdminFirestore } from '../config/db-config';
import { assertUID } from '../config/global-helpers';

const cloneProd = async (product: Product): Promise<FirebaseFirestore.WriteResult> => {
  const db = altEnvAdminFirestore;
  let fbRes: FirebaseFirestore.WriteResult;

  // Add or merge changes to product on alt environment
  fbRes = await db.collection(SharedCollectionPaths.PRODUCTS).doc(product.id).set(product, {merge: true})
    .catch(err => {functions.logger.log(`Failed to clone product data in alt admin`, err); throw new functions.https.HttpsError('internal', err);});
  functions.logger.log('Product cloned in alt admin:', fbRes);

  return fbRes;
}

/////// DEPLOYABLE FUNCTIONS ///////

export const cloneProductOnAltAdmin = functions.https.onCall(async (data: Product, context) => {

  functions.logger.log('Received request to clone product on alt admin with this data', data);
  assertUID(context);

  const product: Product = data;
  
  return  cloneProd(product);
});