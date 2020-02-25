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
import { catchErrors, assertUID } from '../config/global-helpers';
import { explearningAdminStorage } from '../config/storage-config';

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

const adminStorage = explearningAdminStorage;

let blogBucket: Bucket;
let productsBucket: Bucket;

const setBucketsBasedOnEnvironment = (): void => {

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      blogBucket = adminStorage.bucket(ProductionCloudStorage.EXPLEARNING_ADMIN_BLOG_STORAGE_AF_CF);
      productsBucket = adminStorage.bucket(ProductionCloudStorage.EXPLEARNING_ADMIN_PRODUCTS_STORAGE_AF_CF);
      break;
    case EnvironmentTypes.SANDBOX:
      blogBucket = adminStorage.bucket(SandboxCloudStorage.EXPLEARNING_ADMIN_BLOG_STORAGE_AF_CF);
      productsBucket = adminStorage.bucket(SandboxCloudStorage.EXPLEARNING_ADMIN_PRODUCTS_STORAGE_AF_CF);
      break;
    default:
      blogBucket = adminStorage.bucket(SandboxCloudStorage.EXPLEARNING_ADMIN_BLOG_STORAGE_AF_CF);
      productsBucket = adminStorage.bucket(SandboxCloudStorage.EXPLEARNING_ADMIN_PRODUCTS_STORAGE_AF_CF);
      break;
  }
}

// Create a resize image data object
const createResizeImageDataObject = async (metadata: ImageMetadata): Promise<ResizeImageDataObject> => {

  const imageType = metadata.customMetadata.imageType;
  
  setBucketsBasedOnEnvironment();
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
    .catch(err => {console.log(`Error retrieving file of this type ${imageType} at this bucket ${bucket} and this filepath ${filePath}`, err); return err});
  console.log('System metadata for image', existingMetadata);
  const itemId = metadata.customMetadata.itemId;
  console.log('Item id for image', itemId);
  
  const bucketDir = dirname(filePath);

  const workingDir = join(tmpdir(), 'resized'); // Create a working directory
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
    console.log('Object is not an image.');
    return false;
  }

  return true
}

const resizeImgs = async (imageData: ResizeImageDataObject) => {
  // 1. Ensure thumbnail dir exists
  await fs.ensureDir(imageData.workingDir)
    .catch(err => {console.log(`Error ensuring thumbnail dir exists:`, err); return err});

  // 2. Download Source File
  await imageData.bucket.file(imageData.filePath).download({
    destination: imageData.tmpFilePath
  }).catch(err => {console.log(`Error retrieving file of this type ${imageData} at ${imageData.filePath}:`, err); return err});
  console.log('Image downloaded locally to', imageData.tmpFilePath);

  // 3. Resize the images and define an array of upload promises
  let sizes: number[] = [];
  switch (imageData.imageType) {
    case ImageType.BLOG_HERO :
      console.log('Blog hero detected, setting blog hero sizes');
      sizes = blogHeroSizes;
      break;
    case ImageType.BLOG_INLINE:
      console.log('Blog inline detected, setting blog inline sizes');
      sizes = blogInlineImages;
      break;
    case ImageType.PRODUCT_CARD:
      console.log('Product card detected, setting product card sizes');
      sizes = productCardSizes;
      break;
    case ImageType.PRODUCT_HERO:
      console.log('Product hero detected, setting product hero sizes');
      sizes = productHeroSizes;
      break;
    default: sizes = [500];
  }

  // Currently this is configured to REPLACE origin file, meaning only final output will exist
  const createMultiSizes = sizes.map(async size => {
    const thumbName = `${imageData.fileNameNoExt}_thumb@${size}.${imageData.fileExt}`;
    const thumbPath = join(imageData.workingDir, thumbName);
    const destination = join(imageData.bucketDir, "resized", thumbName);
    const metadata = {
      ...imageData.existingMetadata, // This includes item id
      resizedImage: 'true',
      imageSize: size
    };

    // Resize source image
    await sharp(imageData.tmpFilePath)
      .resize(size, null) // Null for height, autoscale to width
      .toFile(thumbPath)
      .catch(err => {console.log(`Error resizing source image:`, err); return err});

    console.log('Thumbnail to be saved at', destination)
    
    // Upload to GCS
    return imageData.bucket.upload(thumbPath, {
      destination: destination,
      contentType: imageData.contentType,
      metadata: {metadata: metadata},
    }).catch(err => {console.log(`Error uploading image data:`, err); return err});
  });

  // 4.1 Run the multi-resize operations
  await Promise.all(createMultiSizes)
    .catch(err => {console.log(`Error in image resize group promise:`, err); return err});
  console.log('All thumbnails uploaded to storage');

  // 4.2 Delete original image
  const signalImageDeleted = imageData.bucket.file(imageData.filePath).delete()
    .catch(err => {console.log(`Error deleting original image:`, err); return err});
  console.log('Original file deleted', imageData.filePath);

  return signalImageDeleted;

}

const updateFBPost = async (imageData: ResizeImageDataObject): Promise<FirebaseFirestore.WriteResult> => {

  const imageUpdate: Partial<Post> = {
    imagesUpdated: now()
  };

  // Set approapriate image size data in Firestore then signal to database that images have been uploaded
  switch (imageData.imageType) {
    case ImageType.BLOG_HERO:
      imageUpdate.imageSizes = blogHeroSizes;
      break;
    case ImageType.BLOG_INLINE:
      imageUpdate.imageSizes = blogInlineImages;
      break;
    case ImageType.PRODUCT_CARD:
      imageUpdate.imageSizes = productCardSizes;
      break;
    case ImageType.PRODUCT_HERO:
      imageUpdate.imageSizes = productHeroSizes;
      break;
    default:
      console.log('No image type detected, image size not set') 
      break;
  }

  return adminFirestore.collection(SharedCollectionPaths.POSTS).doc(imageData.itemId).update(imageUpdate)
    .catch(err => {console.log(`Error updating  original image:`, err); return err});
  
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
  console.log('Received this image metadata', metadata);

  assertUID(context);

  const imageData = await createResizeImageDataObject(metadata);

  // Exit function if invalid object
  if(!objectIsValidCheck(imageData)) {
    return;
  };
  
  return catchErrors(executeActions(imageData));
});