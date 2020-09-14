import * as functions from 'firebase-functions';
import { Product } from '../../../shared-models/products/product.model';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { publicFirestore } from '../config/db-config';
import { assertUID } from '../config/global-helpers';
import { generateProductListUrlObject, generateProductUrlObject } from './helpers';
import { submitCacheUpdateRequest } from './submit-cache-update-request';

const publicDb = publicFirestore;

const publishProduct = async (product: Product) => {
  const fbRes = await publicDb.collection(SharedCollectionPaths.PRODUCTS).doc(product.id).set(product)
    .catch(err => {functions.logger.log(`Failed to publish product on public database:`, err); throw new functions.https.HttpsError('internal', err);});
  functions.logger.log('Product published on public database:', fbRes);

  return fbRes;
}

const deleteProduct = async (product: Product) => {
  const fbRes = await publicDb.collection(SharedCollectionPaths.PRODUCTS).doc(product.id).delete()
    .catch(err => {functions.logger.log(`Failed to delete product on public database:`, err); throw new functions.https.HttpsError('internal', err);});
  functions.logger.log('Product deleted on public database:', fbRes);
  return fbRes;
}

// Publish updates on public and update cache
const updateProductOnPublic = async (product: Product) => {

  const isDeletionRequest = !product.active;
  const productUrlObject = generateProductUrlObject(product);
  const productListUrlObject = generateProductListUrlObject();
  let productFbRes;
  let productCacheUpdateRes;
  let productListCacheUpdateRes;

  // Unpublish on public and update cache
  if (isDeletionRequest) {
    productFbRes = await deleteProduct(product);
    productListCacheUpdateRes = await submitCacheUpdateRequest(productListUrlObject);
    functions.logger.log('Product list cache update transmitted');
    return productFbRes && productListCacheUpdateRes;
  }

  // Publish product
  productFbRes = await publishProduct(product);

  // Update product page cache
  productCacheUpdateRes = await submitCacheUpdateRequest(productUrlObject);
  functions.logger.log('Product cache update transmitted');

  // Update product list page cache (to include new product item)
  productListCacheUpdateRes = await submitCacheUpdateRequest(productListUrlObject);
  functions.logger.log('Product list cache update transmitted');

  return productFbRes && productCacheUpdateRes && productListCacheUpdateRes;
}

/////// DEPLOYABLE FUNCTIONS ///////

export const updateProduct = functions.https.onCall(async (data: Product, context) => {

  functions.logger.log('Received request to update product on public database with this data', data);
  assertUID(context);

  const product: Product = data;
  
  return  updateProductOnPublic(product);
});