import * as functions from 'firebase-functions';
import {Storage, Bucket} from '@google-cloud/storage';
const gcs = new Storage();
import { join, dirname, basename } from 'path';
import { tmpdir } from 'os';
import * as sharp from 'sharp';
import * as fs from 'fs-extra'; // Mirrors the existing filesystem methods, but uses Promises

import adminFirestore from '../db';
import { now } from 'moment';

import { ImageMetadata } from '../../../shared-models/images/image-metadata.model';
import { ImageType } from '../../../shared-models/images/image-type.model';
import { FirebasePaths as BucketName } from '../../../shared-models/routes-and-paths/firebase-paths.model';

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

const blogHeroSizes = [ 500, 1500 ]
const blogInlineImages = [ 150 ]
const productCardSizes = [ 300 ]
const productHeroSizes = [ 500, 1500 ]

export const resizeImages = functions.https.onCall(async (metadata: ImageMetadata, context) => {
  console.log('Received this image metadata', metadata);
  const imageData = await assignVariables(metadata);

  // Exit function if invalid object
  if(!objectIsValidCheck(imageData)) {
    return false;
  };

  // Resize images (and delete original)
  await resizeImgs(imageData);

  // Signal to Firebase that updates are complete
  const outcome = await updateFBPost(imageData);

  // Cleanup remove the tmp/thumbs from the filesystem
  await fs.remove(imageData.workingDir);

  return {outcome}
});

async function assignVariables(metadata: ImageMetadata): Promise<ResizeImageDataObject> {
  const imageType = metadata.customMetadata.imageType;
  
  let bucket: Bucket; // The Storage bucket that contains the file.
  switch (imageType) {
    case ImageType.BLOG_HERO:
      bucket = gcs.bucket(BucketName.BLOG_STORAGE_AF);
      break;
    case ImageType.BLOG_INLINE:
      bucket = gcs.bucket(BucketName.BLOG_STORAGE_AF);
      break;
    case ImageType.PRODUCT_CARD:
      bucket = gcs.bucket(BucketName.PRODUCTS_STORAGE_AF);
      break;
    case ImageType.PRODUCT_HERO:
      bucket = gcs.bucket(BucketName.PRODUCTS_STORAGE_AF);
      break;
    default: bucket = gcs.bucket(BucketName.PRODUCTS_STORAGE_AF);
  }

  const filePath = <string>metadata.customMetadata.filePath; // File path in the bucket.
  const fileName = basename(filePath); // Get the file name.
  // https://stackoverflow.com/a/4250408/6572208 and https://stackoverflow.com/a/5963202/6572208
  const fileNameNoExt = fileName.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');
  // https://stackoverflow.com/a/1203361/6572208
  const fileExt = <string>fileName.split('.').pop();
  const contentType = metadata.contentType; // File content type, used for upload of new file.
  const existingMetadata = 
    await bucket.file(filePath).getMetadata()
      .then(([md, res]) => md.metadata)
      .catch(error => console.log(`Error retrieving file of this type ${imageType} at this bucket ${bucket} and this filepath ${filePath}`, error));  // Extracts existing metadata
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

function objectIsValidCheck (imageData: ResizeImageDataObject) {

  // Exit if this is triggered on a file that is not an image.
  if (!imageData.contentType || !imageData.contentType.includes('image')) {
    console.log('Object is not an image.');
    return false;
  }

  return true
}

async function resizeImgs(imageData: ResizeImageDataObject) {
  // 1. Ensure thumbnail dir exists
  await fs.ensureDir(imageData.workingDir);

  // 2. Download Source File
  await imageData.bucket.file(imageData.filePath).download({
    destination: imageData.tmpFilePath
  }).catch(error => console.log(`Error retrieving file of this type ${imageData} at ${imageData.filePath}`, error));
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
      .toFile(thumbPath);

    console.log('Thumbnail to be saved at', destination)
    
    // Upload to GCS
    await imageData.bucket.upload(thumbPath, {
      destination: destination,
      contentType: imageData.contentType,
      metadata: {metadata: metadata},
    })

    // See https://stackoverflow.com/a/42959262/6572208
    // In order to get signedDownloadUrl, must enable IAM API https://console.developers.google.com/apis/api/iam.googleapis.com/overview?project=explearning-admin
    // Assign the Service account token creator role
    // More here: https://medium.com/@hiranya911/firebase-create-custom-tokens-without-service-account-credentials-d6049c2d2d85
    
    const file = imageData.bucket.file(destination);

    const signedUrls = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    })

    const publicUrl = signedUrls[0];
    console.log('Public url', publicUrl);

    // NOTE CURRENTLY WE AREN'T ACTUALLY USING THIS URL, INSTEAD WE ARE USING THE STORAGE VERSION
    return publicUrl;

  });

  // 4.1 Run the multi-resize operations
  await Promise.all(createMultiSizes);
  console.log('All thumbnails uploaded to storage');

  // 4.2 Delete original image
  const signalImageDeleted = imageData.bucket.file(imageData.filePath).delete()
  console.log('Original file deleted', imageData.filePath);

  return signalImageDeleted;

}

async function updateFBPost(imageData: ResizeImageDataObject): Promise<FirebaseFirestore.WriteResult> {

  // Set approapriate data in Firestore then signal to database that images have been uploaded
  switch (imageData.imageType) {
    case ImageType.BLOG_HERO:
      await adminFirestore.collection('posts').doc(imageData.itemId).update({imageSizes: blogHeroSizes});
      return adminFirestore.collection('posts').doc(imageData.itemId).update({imagesUpdated: now()})
    case ImageType.BLOG_INLINE:
      await adminFirestore.collection('posts').doc(imageData.itemId).update({imageSizes: blogInlineImages});
      return adminFirestore.collection('posts').doc(imageData.itemId).update({imagesUpdated: now()})
    case ImageType.PRODUCT_CARD:
      await adminFirestore.collection('products').doc(imageData.itemId).update({imageSizes: productCardSizes});
      return adminFirestore.collection('products').doc(imageData.itemId).update({imagesUpdated: now()})
    case ImageType.PRODUCT_HERO:
      await adminFirestore.collection('products').doc(imageData.itemId).update({imageSizes: productHeroSizes});
      return adminFirestore.collection('products').doc(imageData.itemId).update({imagesUpdated: now()})
    default: 
      await adminFirestore.collection('products').doc(imageData.itemId).update({imageSizes: productCardSizes});
      return adminFirestore.collection('products').doc(imageData.itemId).update({imagesUpdated: now()})
  }
}