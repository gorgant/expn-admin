import * as functions from 'firebase-functions';
import {Storage, Bucket} from '@google-cloud/storage';
const gcs = new Storage();
import { join, dirname, basename } from 'path';
import { tmpdir } from 'os';
import * as sharp from 'sharp';
import * as fs from 'fs-extra'; // Mirrors the existing filesystem methods, but uses Promises

import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore(); // Set Firestore database
import { now } from 'moment';

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
  metageneration: number;
  postId: string;
}

enum PostImageType {
  HERO = 'hero-image',
  INLINE = 'inline-image'
}

const heroImageSizes = [ 500, 1000, 1500 ]
const inlineImageSizes = [ 300, 500 ]
const bucketName = 'explearning-admin-blog';

// Courtesty of https://angularfirebase.com/lessons/image-thumbnail-resizer-cloud-function/
export const resizeBlogImages = functions.storage
  .bucket(bucketName) // Specificy bucket here
  .object()
  .onFinalize( async object => {
    console.log(object);
    
    const imageData = assignVariables(object);

    // Exit function if invalid object
    if(!objectIsValidCheck(imageData)) {
      return false;
    };

    // Resize images (and delete original)
    await resizeImages(imageData);

    // Signal to Firebase that updates are complete
    await updateFBPost(imageData);

    // Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(imageData.workingDir);

});

function assignVariables(object: functions.storage.ObjectMetadata): ResizeImageDataObject {
  const bucket = gcs.bucket(object.bucket); // The Storage bucket that contains the file.
  const filePath = <string>object.name; // File path in the bucket.
  const fileName = basename(filePath); // Get the file name.
  // https://stackoverflow.com/a/4250408/6572208 and https://stackoverflow.com/a/5963202/6572208
  const fileNameNoExt = fileName.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');
  // https://stackoverflow.com/a/1203361/6572208
  const fileExt = <string>fileName.split('.').pop();

  const contentType = <string>object.contentType; // File content type, used for upload of new file.
  const metageneration = parseInt(<string>object.metageneration, 10); // Detects how many times file has been modified
  const existingMetadata = <{[key: string]: string}>object.metadata;  // Extracts existing metadata
  const postId = existingMetadata.postId;
  console.log('Post id for image', postId);
  
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
    metageneration,
    postId
  }
  return resizeImageDataObject;
}

function objectIsValidCheck (imageData: ResizeImageDataObject) {
  // Exit if file has been resized, which would append the 'thumb@'
  if (imageData.fileName.includes('thumb@')) {
    console.log('Object filename includes @');
    return false;
  }

  // Exit if this is triggered on a file that is not an image.
  if (!imageData.contentType || !imageData.contentType.includes('image')) {
    console.log('Object is not an image.');
    return false;
  }
  // Exit if the image has already been modified.
  if (imageData.existingMetadata.resizedImage === 'true') {
    console.log('Object has already been resized', imageData.existingMetadata.resizedImage);
    return false;
  }

  if (imageData.metageneration > 2) {
    console.log('Object metadata has been modified more than twice');
    return false;
  }

  return true
}

async function resizeImages(imageData: ResizeImageDataObject) {
    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(imageData.workingDir);

    // 2. Download Source File
    await imageData.bucket.file(imageData.filePath).download({
      destination: imageData.tmpFilePath
    });
    console.log('Image downloaded locally to', imageData.tmpFilePath);

    // 3. Resize the images and define an array of upload promises
    let sizes: number[] = [];

    if (imageData.existingMetadata.postImageType === PostImageType.HERO) {
      console.log('Hero detected, setting hero sizes');
      sizes = heroImageSizes;
    }

    // Object is an inline image
    if (imageData.existingMetadata.postImageType === PostImageType.INLINE) {
      console.log('Inline detected, setting inline sizes');
      sizes = inlineImageSizes;
    }

    
    // Currently this is configured to REPLACE origin file (rather than multiple files with unique names), meaning only final output will exist
    // To properly store multiple sizes without replacing origin file, change desitantion 'fileName' to 'thumbName'
    const createMultiSizes = sizes.map(async size => {
      const thumbName = `${imageData.fileNameNoExt}_thumb@${size}.${imageData.fileExt}`;
      const thumbPath = join(imageData.workingDir, thumbName);
      const destination = join(imageData.bucketDir, "resized", thumbName);
      const metadata = {
        ...imageData.existingMetadata, // This includes postId
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

  // Set hero sizes
  if (imageData.existingMetadata.postImageType === PostImageType.HERO) {
    await db.collection('posts').doc(imageData.postId).update({imageSizes: heroImageSizes})
  }

  // Set inline sizes
  if (imageData.existingMetadata.postImageType === PostImageType.INLINE) {
    await db.collection('posts').doc(imageData.postId).update({imageSizes: inlineImageSizes})
  }

  console.log('Marking images updated')
  // Signal to database that blog images have been uploaded
  const updateResponse = db.collection('posts').doc(imageData.postId).update({imagesUpdated: now()})

  return updateResponse;
}
