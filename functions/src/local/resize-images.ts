import * as functions from 'firebase-functions';
import { Bucket } from '@google-cloud/storage';
import { join, dirname, basename } from 'path';
import { tmpdir } from 'os';
import * as sharp from 'sharp';
import * as fs from 'fs-extra'; // Mirrors the existing filesystem methods, but uses Promises

import { now } from 'moment';

import { ImageMetadata } from '../../../shared-models/images/image-metadata.model';
import { ImageType } from '../../../shared-models/images/image-type.model';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { adminFirestore } from '../config/db-config';
import { EnvironmentTypes, ProductionCloudStorage, SandboxCloudStorage } from '../../../shared-models/environments/env-vars.model';
import { currentEnvironmentType } from '../config/environments-config';
import { Post } from '../../../shared-models/posts/post.model';
import { assertUID } from '../config/global-helpers';
import { expnAdminStorage } from '../config/storage-config';
import { AdminCsDirectoryPaths } from '../../../shared-models/routes-and-paths/cs-directory-paths';

interface ResizeImageDataObject {
  fileName: string;
  workingDir: string;
  bucket: Bucket;
  filePath: string;
  tmpFilePath: string;
  fileNameNoExt: string;
  fileExt: string;
  bucketDir: string;
  existingMetadata: {[key: string]: string};
  contentType: string;
  itemId: string;
  imageType: ImageType;
}

const blogHeroSizes = [ 300, 1500 ] // Actually just a thumbnail
const blogInlineImages = [ 300, 700 ]
const productCardSizes = [ 300 ]
const productHeroSizes = [ 500, 1500 ]

const adminStorage = expnAdminStorage;

const blogBucket = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? 
  adminStorage.bucket(ProductionCloudStorage.EXPN_ADMIN_BLOG_STORAGE_AF_CF) : 
  adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_BLOG_STORAGE_AF_CF);

const productsBucket = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? 
  adminStorage.bucket(ProductionCloudStorage.EXPN_ADMIN_PRODUCTS_STORAGE_AF_CF) : 
  adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_PRODUCTS_STORAGE_AF_CF);

// Create a resize image data object
const createResizeImageDataObject = async (metadata: ImageMetadata): Promise<ResizeImageDataObject> => {

  const imageType = metadata.customMetadata.imageType;
  
  let bucket: Bucket; // The Storage bucket that contains the file.

  // Set bucket based on image type
  switch (imageType) {
    case ImageType.BLOG_HERO:
      bucket = blogBucket;
      break;
    case ImageType.BLOG_INLINE:
      bucket = blogBucket;
      break;
    case ImageType.PRODUCT_CARD:
      bucket = productsBucket;
      break;
    case ImageType.PRODUCT_HERO:
      bucket = productsBucket;
      break;
    default: 
      bucket = productsBucket;
      break;
  }

  const filePath = <string>metadata.customMetadata.filePath; // File path in the bucket.
  const fileName = basename(filePath); // Get the file name.
  // https://stackoverflow.com/a/4250408/6572208 and https://stackoverflow.com/a/5963202/6572208
  const fileNameNoExt = fileName.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');
  // https://stackoverflow.com/a/1203361/6572208
  const fileExt = <string>fileName.split('.').pop();
  const contentType = metadata.contentType; // File content type, used for upload of new file.
  const existingMetadata = await bucket.file(filePath).getMetadata()   // Extracts existing metadata
    .then(([md, res]) => md.metadata)
    .catch(err => {functions.logger.log(`Error retrieving metadata for file of this type ${imageType} at this bucket ${bucket} and this filepath ${filePath}:`, err); return err});
  functions.logger.log('System metadata for image', existingMetadata);
  const itemId = metadata.customMetadata.itemId;
  functions.logger.log('Item id for image', itemId);
  
  const bucketDir = dirname(filePath);

  const workingDir = join(tmpdir(), AdminCsDirectoryPaths.RESIZED_IMAGES); // Create a working directory
  const tmpFilePath = join(workingDir, fileName) // Create a temp file path

  // Used to package and transport data to other functions
  const resizeImageDataObject: ResizeImageDataObject = {
    fileName,
    workingDir,
    bucket,
    filePath,
    tmpFilePath,
    fileNameNoExt,
    fileExt,
    bucketDir,
    existingMetadata,
    contentType,
    itemId,
    imageType
  }
  return resizeImageDataObject;
}

const objectIsValidCheck = (imageData: ResizeImageDataObject): boolean => {

  // Exit if this is triggered on a file that is not an image.
  if (!imageData.contentType || !imageData.contentType.includes('image')) {
    functions.logger.log('Object is not an image.');
    return false;
  }

  return true
}

const resizeImgs = async (imageData: ResizeImageDataObject) => {
  // 1. Ensure thumbnail dir exists
  await fs.ensureDir(imageData.workingDir)
    .catch(err => {functions.logger.log(`Error ensuring thumbnail dir exists:`, err); throw new functions.https.HttpsError('internal', err);});
    

  // 2. Download Source File
  await imageData.bucket.file(imageData.filePath).download({
    destination: imageData.tmpFilePath
  })
    .catch(err => {functions.logger.log(`Error retrieving file of this type ${imageData} at ${imageData.filePath}:`, err); throw new functions.https.HttpsError('internal', err);});
  functions.logger.log('Image downloaded locally to', imageData.tmpFilePath);

  // 3. Resize the images and define an array of upload promises
  let sizes: number[] = [];
  switch (imageData.imageType) {
    case ImageType.BLOG_HERO :
      functions.logger.log('Blog hero detected, setting blog hero sizes');
      sizes = blogHeroSizes;
      break;
    case ImageType.BLOG_INLINE:
      functions.logger.log('Blog inline detected, setting blog inline sizes');
      sizes = blogInlineImages;
      break;
    case ImageType.PRODUCT_CARD:
      functions.logger.log('Product card detected, setting product card sizes');
      sizes = productCardSizes;
      break;
    case ImageType.PRODUCT_HERO:
      functions.logger.log('Product hero detected, setting product hero sizes');
      sizes = productHeroSizes;
      break;
    default: sizes = [500];
  }

  // Currently this is configured to REPLACE origin file, meaning only final output will exist
  const createMultiSizes = sizes.map(async size => {
    const thumbName = `${imageData.fileNameNoExt}${AdminCsDirectoryPaths.RESIZED_IMAGE_FILE_PREFIX}${size}.${imageData.fileExt}`;
    const thumbPath = join(imageData.workingDir, thumbName);
    const destination = join(imageData.bucketDir, AdminCsDirectoryPaths.RESIZED_IMAGES, thumbName);
    const metadata = {
      ...imageData.existingMetadata, // This includes item id
      resizedImage: 'true',
      imageSize: size
    };

    // Resize source image
    await sharp(imageData.tmpFilePath)
      .resize(size, null) // Null for height, autoscale to width
      .toFile(thumbPath)
      .catch(err => {functions.logger.log(`Error resizing source image:`, err); throw new functions.https.HttpsError('internal', err);});

    functions.logger.log('Thumbnail to be saved at', destination)
    
    // Upload to GCS
    return imageData.bucket.upload(thumbPath, {
      destination: destination,
      contentType: imageData.contentType,
      metadata: {metadata: metadata},
    })
      .catch(err => {functions.logger.log(`Error uploading image data:`, err); throw new functions.https.HttpsError('internal', err);});
  });

  // 4.1 Run the multi-resize operations
  await Promise.all(createMultiSizes)
  functions.logger.log('All thumbnails uploaded to storage');

  // 4.2 Delete original image
  const signalImageDeleted = imageData.bucket.file(imageData.filePath).delete()
    .catch(err => {functions.logger.log(`Error deleting original image:`, err); throw new functions.https.HttpsError('internal', err);});
  functions.logger.log('Original file deleted', imageData.filePath);

  return signalImageDeleted;

}

const updateFBPost = async (imageData: ResizeImageDataObject): Promise<FirebaseFirestore.WriteResult> => {

  const imageUpdate: Partial<Post> = {
    imagesUpdated: now()
  };

  let collectionPath = '';

  // Set approapriate image size data in Firestore then signal to database that images have been uploaded
  switch (imageData.imageType) {
    case ImageType.BLOG_HERO:
      imageUpdate.imageSizes = blogHeroSizes;
      collectionPath = SharedCollectionPaths.POSTS;
      break;
    case ImageType.BLOG_INLINE:
      imageUpdate.imageSizes = blogInlineImages;
      collectionPath = SharedCollectionPaths.POSTS;
      break;
    case ImageType.PRODUCT_CARD:
      imageUpdate.imageSizes = productCardSizes;
      collectionPath = SharedCollectionPaths.PRODUCTS;
      break;
    case ImageType.PRODUCT_HERO:
      imageUpdate.imageSizes = productHeroSizes;
      collectionPath = SharedCollectionPaths.PRODUCTS;
      break;
    default:
      functions.logger.log('No image type detected, image size not set') 
      break;
  }

  return adminFirestore.collection(collectionPath).doc(imageData.itemId).update(imageUpdate)
    .catch(err => {functions.logger.log(`Error updating image:`, err); throw new functions.https.HttpsError('internal', err);});
    
  
}

const executeActions = async (imageData: ResizeImageDataObject) => {

  // Resize images (and delete original)
  await resizeImgs(imageData);

  // Signal to Firebase that updates are complete
  await updateFBPost(imageData);

  // Cleanup remove the tmp/thumbs from the filesystem
  await fs.remove(imageData.workingDir);
}

/////// DEPLOYABLE FUNCTIONS ///////

export const resizeImages = functions.https.onCall(async (metadata: ImageMetadata, context) => {
  functions.logger.log('Received this image metadata', metadata);

  assertUID(context);

  const imageData = await createResizeImageDataObject(metadata);

  // Exit function if invalid object
  if(!objectIsValidCheck(imageData)) {
    return;
  };
  
  return executeActions(imageData);
});