import * as functions from 'firebase-functions';
import { Product } from '../../../shared-models/products/product.model';
import { FbCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../db';

export const updateProduct = functions.https.onCall(async (data: Product, context) => {
  const outcome = await updateProd(data);
  return {outcome}
});


async function updateProd(product: Product) {


  const pubFirestore = await publicFirestore;

  // If product is active on admin, add to public
  if (product.active) {
    const fbRes = await pubFirestore.collection(FbCollectionPaths.PRODUCTS).doc(product.id).set(product)
      .catch(error => console.log(error));
    console.log('Product activated');
    return fbRes;
  }

  // If product is not active on admin, remove from public
  if (!product.active) {
    const fbRes = await pubFirestore.collection(FbCollectionPaths.PRODUCTS).doc(product.id).delete()
      .catch(error => console.log(error));
    console.log('Product deactivated');
    return fbRes;
  }

}
