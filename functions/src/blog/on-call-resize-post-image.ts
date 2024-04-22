import { logger } from 'firebase-functions/v2';
import { CallableOptions, CallableRequest, HttpsError, onCall } from 'firebase-functions/v2/https';
import { ensureDir, remove } from 'fs-extra'; // Mirrors the existing filesystem methods, but uses Promises
import { basename, dirname, join } from 'path';
import { tmpdir } from 'os';
import * as sharp from 'sharp';
import { currentEnvironmentType } from '../config/environments-config';
import { EnvironmentTypes, ProductionCloudStorage, SandboxCloudStorage } from '../../../shared-models/environments/env-vars.model';
import { adminFirestore } from '../config/db-config';
import { SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths.model';
import { Timestamp } from '@google-cloud/firestore';
import { adminStorage } from '../config/storage-config';
import { PostImageMetadata } from '../../../shared-models/images/image-metadata.model';
import { AdminCsDirectoryPaths, RESIZED_IMAGE_FILE_PREFIX } from '../../../shared-models/routes-and-paths/cs-directory-paths.model';
import { BlogIndexRef, DefaultPostHeroImageSizeObject, Post, PostHeroImageData } from '../../../shared-models/posts/post.model';

const defaultImageSizes: DefaultPostHeroImageSizeObject = {
  smallImage: 500,
  largeImage: 1500,
};

const adminBlogStorageBucket = currentEnvironmentType === EnvironmentTypes.PRODUCTION ? 
  adminStorage.bucket(ProductionCloudStorage.EXPN_ADMIN_BLOG_STORAGE_NO_PREFIX) :
  adminStorage.bucket(SandboxCloudStorage.EXPN_ADMIN_BLOG_STORAGE_NO_PREFIX);

// Exit if file is not an image.
const objectIsValidCheck = (imageMetaData: PostImageMetadata): boolean => {
  if (!imageMetaData.contentType || !imageMetaData.contentType.includes('image')) {
    logger.log('Object is not an image.');
    return false;
  }
  return true
}

const resizeImage = async (imageMetaData: PostImageMetadata): Promise<PostHeroImageData> => {
  
  const originalImageFilePath = imageMetaData.customMetadata.filePath;
  const originalImageFileName = basename(originalImageFilePath);
  const originalImageFileNameNoExt = imageMetaData.customMetadata.fileNameNoExt;
  const postId = imageMetaData.customMetadata.postId;
  const contentType = imageMetaData.contentType;
  
  const sourceDir = dirname(originalImageFilePath);
  const workingDir = join(tmpdir(), AdminCsDirectoryPaths.POST_IMAGES, postId);
  const tmpFilePath = join(workingDir, originalImageFileName);

  const existingMetadata = await adminBlogStorageBucket.file(originalImageFilePath).getMetadata();   // Extracts existing metadata
  logger.log(`Fetched this existing metadata from cloud storage:`, existingMetadata);

  // 1. Ensure directory exists
  await ensureDir(workingDir)
    .catch(err => {logger.log(`Error ensuring directory exists:`, err); throw new HttpsError('internal', err);});
    

  // 2. Download Source File
  await adminBlogStorageBucket.file(originalImageFilePath).download({
    destination: tmpFilePath
  })
    .catch(err => {logger.log(`Error retrieving file at ${originalImageFilePath}:`, err); throw new HttpsError('internal', err);});
  logger.log('Image downloaded locally to', tmpFilePath);

  // 3. Resize the images
  // Currently this is configured to REPLACE origin file, meaning only final output will exist

  const heroImages: PostHeroImageData = {
    imageUrlLarge: '',
    imageUrlSmall: '',
  }

  // Loops through an object for each of the keys, courtesy of GPT: https://chat.openai.com/share/e/042abe36-a6ba-4d8f-940a-82f599310680
  for (const key in defaultImageSizes) {
    if (defaultImageSizes.hasOwnProperty(key)) {
      const newImageSize = defaultImageSizes[key as keyof DefaultPostHeroImageSizeObject];

      const newThumbName = `${originalImageFileNameNoExt}_${Timestamp.now().toMillis().toString().slice(-6)}${RESIZED_IMAGE_FILE_PREFIX}${newImageSize}.webp`; // Adding this unique string at the end makes the image caching more effective
      const tempThumbPath = join(workingDir, newThumbName);
      const finalDestination = join(sourceDir, newThumbName);
      const metadata = {
        ...existingMetadata, // This includes item id
        resizedImage: 'true'    
      };
    
      logger.log('Thumbnail to be saved at', finalDestination);

      await sharp(tmpFilePath)
        .resize({width: newImageSize}) // GPT suggests resizing first is best
        .webp({ quality: 80 })  // Set the quality for WebP conversion
        .toFile(tempThumbPath);
    
      // Upload to GCS
      const response = await adminBlogStorageBucket.upload(tempThumbPath, {
        destination: finalDestination,
        contentType: contentType,
        metadata: {metadata: metadata},
      })
        .catch(err => {logger.log(`Error uploading image data:`, err); throw new HttpsError('internal', err);});
    
      // Make the file publicly accessible
      await response[0].makePublic()
        .catch(err => {logger.log(`Error making image public:`, err); throw new HttpsError('internal', err);});
    
      // Then fetch the download url
      const imageDownloadUrl = response[0].publicUrl();
  
      // Example operation: checking if the value is greater than 1000
      if (newImageSize === defaultImageSizes.smallImage) {
        heroImages.imageUrlSmall = imageDownloadUrl;
      }

      if (newImageSize === defaultImageSizes.largeImage) {
        heroImages.imageUrlLarge = imageDownloadUrl;
      }
    }
  }

  // 4. Delete original image in source directory
  const deleteOriginalImage = adminBlogStorageBucket.file(originalImageFilePath).delete()
    .catch(err => {logger.log(`Error deleting original image:`, err); throw new HttpsError('internal', err);});
  logger.log('Original file deleted', originalImageFilePath);

  await deleteOriginalImage;

  // 5. Remove the tmp/thumbs from the filesystem
  await remove(workingDir);

  return heroImages;
}

const updatePostImageUrl = async (imageMetaData: PostImageMetadata, heroImages: PostHeroImageData) => {
  const postsCollection = adminFirestore.collection(SharedCollectionPaths.POSTS);
  const blogIndexRefCollection = adminFirestore.collection(SharedCollectionPaths.BLOG_INDEX_REFS);
  const currentTimestamp = Timestamp.now() as any;

  const postId = imageMetaData.customMetadata.postId;
  const postUpdates: Partial<Post> = {
    heroImages: {
      imageUrlLarge: heroImages.imageUrlLarge,
      imageUrlSmall: heroImages.imageUrlSmall
    },
    imagesLastUpdatedTimestamp: currentTimestamp,
    lastModifiedTimestamp: currentTimestamp,
  };

  const blogIndexRefUpdates: Partial<BlogIndexRef> = {
    heroImages: {
      imageUrlLarge: heroImages.imageUrlLarge,
      imageUrlSmall: heroImages.imageUrlSmall
    },
    lastModifiedTimestamp: currentTimestamp,
  }

  await postsCollection.doc(postId).update(postUpdates)
    .catch(err => {logger.log(`Failed to update post with id ${postId} in admin database:`, err); throw new HttpsError('internal', err);});

  await blogIndexRefCollection.doc(postId).update(blogIndexRefUpdates)
    .catch(err => {logger.log(`Failed to update blogIndexRef with id ${postId} in admin database:`, err); throw new HttpsError('internal', err);});
}


const executeActions = async (imageMetaData: PostImageMetadata): Promise<PostHeroImageData> => {
  
  const resizedPostImageDownloadUrl = await resizeImage(imageMetaData);
  
  await updatePostImageUrl(imageMetaData, resizedPostImageDownloadUrl);

  return resizedPostImageDownloadUrl;
}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true
};

export const onCallResizePostImage = onCall(callableOptions, async (request: CallableRequest<PostImageMetadata>): Promise<PostHeroImageData> => {
  const imageMetaData = request.data;  
  logger.log(`onCallResizePost requested with this data:`, imageMetaData);

  // Exit function if invalid object
  if(!objectIsValidCheck(imageMetaData)) {
    throw new HttpsError('failed-precondition', 'Invalid image object detected.');
  };

  const postHeroImageData: PostHeroImageData = await executeActions(imageMetaData);

  return postHeroImageData;
});