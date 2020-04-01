import * as functions from 'firebase-functions';
import { Product } from '../../../shared-models/products/product.model';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../config/db-config';
import { assertUID } from '../config/global-helpers';

const updateProd = async (product: Product): Promise<FirebaseFirestore.WriteResult> => {
  const db = publicFirestore;
  let fbRes: FirebaseFirestore.WriteResult;
  
  // If product is not active on admin, remove from public
  if (!product.active) {
    fbRes = await db.collection(SharedCollectionPaths.PRODUCTS).doc(product.id).delete()
      .catch(err => {console.log(`Failed to delete product data from public database`, err); throw new functions.https.HttpsError('internal', err);});
    console.log('Product deleted from public database', fbRes);
  }

  // If product is active on admin, add to public
  fbRes = await db.collection(SharedCollectionPaths.PRODUCTS).doc(product.id).set(product)
    .catch(err => {console.log(`Failed to update product data in public database`, err); throw new functions.https.HttpsError('internal', err);});
  console.log('Product data updated in public database:', fbRes);

  return fbRes;
}

/////// DEPLOYABLE FUNCTIONS ///////

export const updateProduct = functions.https.onCall(async (data: Product, context) => {

  console.log('Received request to update product on public database with this data', data);
  assertUID(context);

  const product: Product = data;
  
  return  updateProd(product);
});