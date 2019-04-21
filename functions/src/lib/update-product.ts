import * as functions from 'firebase-functions';
import { getPublicApp } from '../public-app';
import { Product } from '../../../shared-models/products/product.model';

export const updateProduct = functions.https.onCall(async (data: Product, context) => {
  const outcome = await updateProd(data);
  return {outcome}
});


async function updateProd(product: Product) {

  const publicApp = await getPublicApp();

  const publicFirestore = publicApp.firestore();

  // If product is active on admin, add to public
  if (product.active) {
    const fbRes = await publicFirestore.collection('products').doc(product.id).set(product)
      .catch(error => console.log(error));
    console.log('Product activated');
    return fbRes;
  }

  // If product is not active on admin, remove from public
  if (!product.active) {
    const fbRes = await publicFirestore.collection('products').doc(product.id).delete()
      .catch(error => console.log(error));
    console.log('Product deactivated');
    return fbRes;
  }

}
