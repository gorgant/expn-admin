import * as firebase from 'firebase/app';
import { UploadMetadata } from '@angular/fire/storage/interfaces';
import { SanitizedFileName } from '../models/posts/sanitized-file-name.model';
import { ImageType } from '../models/images/image-type.model';
import { Post } from '../models/posts/post.model';
import { FirebasePaths } from '../models/routes-and-paths/firebase-paths.model';
import { ImageUrlObject } from '../models/images/image-url-object.model';
import { ImageDirectoryData } from '../models/images/image-directory-data.model';
import { ImageMetadata } from '../models/images/image-metadata.model';
import { Product } from '../models/products/product.model';

// TODO: This works only if a hero image is uploaded first -- figure out why

// Adapted from https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html
export class InlineImageUploadAdapter {

  loader;
  postId: string;

  private blogStorageRef = firebase.app().storage(FirebasePaths.BLOG_STORAGE_FB).ref();
  private productsStorageRef = firebase.app().storage(FirebasePaths.PRODUCTS_STORAGE_FB).ref();
  private db = firebase.firestore(); // Firebase database
  private fns = firebase.functions(); // Firebase functions

  imageSizes: number[];


  constructor(loader, postId) {
    this.loader = loader;
    this.postId = postId;
    console.log('Constructing adapter with post id', postId);
  }

  // Starts the upload process.
  async upload() {
    const file = await this.loader.file;


    return new Promise( async (resolve, reject) => {
      console.log('Detected this file', file);
      const itemId = this.postId;
      const imageType = ImageType.BLOG_INLINE;

      const imageDirectoryData = this.setImageDirectoryData(file, itemId, imageType);
      const urlObject = await this.uploadImageAndFetchUrls(file, itemId, imageDirectoryData, imageType);

      if (!urlObject || urlObject as unknown === 'Only image files allowed') {
        reject('Error loading image');
      }
      console.log('About to resolve upload with url', urlObject);
      resolve(urlObject);
    });
  }

  // Aborts the upload process.
  abort() {
    console.log('Upload aborted');
  }

  private uploadImageAndFetchUrls(
    file: File,
    itemId: string,
    imageDirectoryData: ImageDirectoryData,
    imageType: ImageType
  ): Promise<ImageUrlObject> {

    const path = imageDirectoryData.imagePath;
    const imagePathRef = this.getItemFileRef(path, imageType);

    const metadata: ImageMetadata = {
      contentType: file.type,
      customMetadata: {
        imageType,
        itemId,
        filePath: path,
      }
    };

    // Need to convert to unkown first to adhere to Firebase api
    const fbFriendlyMetaData: unknown = {
      ...metadata
    };

    const uploadTask = imagePathRef.put(file, fbFriendlyMetaData as UploadMetadata);

    console.log('About to commence upload', imagePathRef, file);


    const urlObject = new Promise<ImageUrlObject> ( (resolve, reject) => {
      uploadTask.on('state_changed', (snapshot) => {

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }

        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');


      }, (error) => {
        console.log('Error uploading file', error);
        return reject(`Error uploading file: ${error}`);
      }, async () => {

        // Trigger cloud function to resize images
        await this.resizeImagesOnServer(metadata);
        console.log('Triggering cloud function image reiszing', metadata);

        // Wait for image resizing to complete, then fetch the sizes
        const imageSizes = await this.fetchImageSizes(itemId, imageType);
        console.log('Post updated, fetching download urls');

        // Construct a url object using those sizes
        const urlObj = await this.fetchDownloadUrls(imageDirectoryData, itemId, imageType, imageSizes);
        console.log('Retrieved this url object', urlObj);

        resolve(urlObj);
      });
    });

    return urlObject;

  }

  private async resizeImagesOnServer(metadata: ImageMetadata) {


    const resizeImagesHttpCall = this.fns.httpsCallable('resizeImages');

    const response = await resizeImagesHttpCall(metadata)
      .catch(error =>  console.log('Error updating item data on server', error));

    console.log('Resized image url set on item', response);

    return response;

  }

  // Listen for item update and then fetch image sizes when available
  private fetchImageSizes(itemId: string, imageType: ImageType): Promise<number[]> {
    console.log('About to listen for post with id', itemId);

    const imageSizeArray: Promise<number[]> = new Promise((resolve, reject) => {

      const itemListener = this.getItemRef(itemId, imageType)
      .onSnapshot( async (doc) => {
        console.log('Listening for item update. Current data: ', doc.data());
        const docData = doc.data() as Post | Product;
        if (docData.imagesUpdated) {
          const imageSizes = docData.imageSizes;
          this.clearImageSizes(itemId, imageType);
          resolve(imageSizes); // Signal next step in logic once resized images have been processed
          itemListener(); // Unsubscribe
          console.log('images updated, dbListener unsubscribed');
        }
      }, (error) => {
        console.log('Error getting post snapshot', error);
      });

    });

    return imageSizeArray;

  }

  private async fetchDownloadUrls(
    imageDirectoryData: ImageDirectoryData,
    itemId: string,
    imageType: ImageType,
    imageSizes: number[]
  ): Promise<ImageUrlObject> {

    // Generate a set of image paths based on imageSizes
    const imagePathKeyPairs = [];
    imageSizes.map(size => {
      const pathdict = {
        // tslint:disable-next-line:max-line-length
        [size]: `${imageDirectoryData.resizedImagesPath}/${imageDirectoryData.resizedFileNamePrefix}${size}${imageDirectoryData.resizedFileNameExt}`
      };
      imagePathKeyPairs.push(pathdict);
    });
    console.log('Image paths retrieved', imagePathKeyPairs);

    this.storeImagePaths(itemId, imageType, imagePathKeyPairs);

    // Get download urls and map them to their size key
    const imageUrls: Promise<ImageUrlObject> = imagePathKeyPairs.reduce(async (acc: Promise<{}>, dict) => {
      // This collection is required to resolve the acc promise in the async
      const collection: {} = await acc;

      // Get the dict key
      const keyArray = Object.keys(dict);
      const key = keyArray[0];
      const filePath = dict[key];

      console.log('Fetching file with this path', filePath);
      const url: string = await this.getItemFileRef(filePath, imageType).getDownloadURL()
        .catch(error => console.log(error));
      console.log('Url retreivied', url);
      collection[key] = url;
      return collection;
    }, Promise.resolve([]));

    const urlsNoDefault = await imageUrls;

    const urlsWithDefault = this.insertDefaultUrl(urlsNoDefault);

    return urlsWithDefault;
  }

  private async clearImageSizes(itemId: string, imageType: ImageType): Promise<void> {

    return this.getItemRef(itemId, imageType).update(
      {
        imageSizes: null,
        imagesUpdated: null,
      }
    ).then(res => {
      console.log('Item image data cleared');
    }).catch(error => {
      console.log('Error clearning image sizes');
    });
  }

  private insertDefaultUrl(imageUrls: ImageUrlObject): ImageUrlObject {

    // Get the largest image size
    const keyArray = Object.keys(imageUrls);
    keyArray.sort((a, b) => Number(a)  - Number(b)); // Ensure largest key is at end
    const largestKey = keyArray[keyArray.length - 1];

    // Insert it into the object as default
    const updatedObject: ImageUrlObject = {...imageUrls};
    const defaultKey = 'default';
    updatedObject[defaultKey] = imageUrls[largestKey];
    console.log('Updated object with default added', updatedObject);
    return updatedObject;
  }

  private async storeImagePaths(itemId: string, imageType: ImageType, pathKeyPairArray: any[]): Promise<void> {

    // Isolate image urls and assign paths
    const imagePaths: string[] = pathKeyPairArray.map(keyPair => {
      const key = Object.keys(keyPair)[0];
      const path = keyPair[key];
      return path;
    });

    console.log('Image paths to add to item doc', imagePaths);

    const itemRef = this.getItemRef(itemId, imageType);
    const itemDoc = await itemRef.get()
      .catch(error => {console.log('Error getting item', error); });
    const item: Post | Product = itemDoc ? itemDoc.data() as Post | Product : null;

    let existingList: string[] = [];
    if (item.imageFilePathList) {
      console.log('Existing image files detected on item');
      existingList = existingList.concat(item.imageFilePathList);
    }
    const updatedList = existingList.concat(imagePaths);
    const dedupedList = [...Array.from(new Set(updatedList))];
    console.log('Deduped updated file list', dedupedList);

    itemRef.update({
      imageFilePathList: dedupedList
    });

  }

  // The following are helper function used in both core functions

  private getItemRef(itemId: string, imageType: ImageType): firebase.firestore.DocumentReference {
    switch (imageType) {
      case ImageType.BLOG_HERO:
        return this.db.collection('posts').doc(itemId);
      case ImageType.BLOG_INLINE:
        return this.db.collection('posts').doc(itemId);
      case ImageType.PRODUCT:
        return this.db.collection('products').doc(itemId);
      default: return this.db.collection('products').doc(itemId);
    }

  }

  private getItemFileRef(path: string, imageType: ImageType): firebase.storage.Reference {
    switch (imageType) {
      case ImageType.BLOG_HERO:
        return this.blogStorageRef.child(path);
      case ImageType.BLOG_INLINE:
        return this.blogStorageRef.child(path);
      case ImageType.PRODUCT:
        return this.productsStorageRef.child(path);
      default: return this.productsStorageRef.child(path);
    }
  }

  private sanitizeFileName(file: File): SanitizedFileName {
    // https://stackoverflow.com/a/4250408/6572208 and https://stackoverflow.com/a/5963202/6572208
    const fileNameNoExt = file.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');
    // https://stackoverflow.com/a/1203361/6572208
    const fileExt = file.name.split('.').pop();
    const fullFileName = fileNameNoExt + '.' + fileExt;

    return {
      fileNameNoExt,
      fileExt,
      fullFileName
    };
  }

  private setImageDirectoryData(file: File, itemId: string, imageType: ImageType): ImageDirectoryData {
    const sanitizedFileName = this.sanitizeFileName(file);
    let imagePath: string;
    let imageDirectory: string;
    switch (imageType) {
      case ImageType.BLOG_HERO:
        imagePath = `posts/${itemId}/${sanitizedFileName.fileNameNoExt}/${sanitizedFileName.fullFileName}`;
        imageDirectory = `posts/${itemId}/${sanitizedFileName.fileNameNoExt}`;
        break;
      case ImageType.BLOG_INLINE:
        imagePath = `posts/${itemId}/${sanitizedFileName.fileNameNoExt}/${sanitizedFileName.fullFileName}`;
        imageDirectory = `posts/${itemId}/${sanitizedFileName.fileNameNoExt}`;
        break;
      case ImageType.PRODUCT:
        imagePath = `products/${itemId}/${sanitizedFileName.fileNameNoExt}/${sanitizedFileName.fullFileName}`;
        imageDirectory = `products/${itemId}/${sanitizedFileName.fileNameNoExt}`;
        break;
      default:
        imagePath = `products/${itemId}/${sanitizedFileName.fileNameNoExt}/${sanitizedFileName.fullFileName}`;
        imageDirectory = `products/${itemId}/${sanitizedFileName.fileNameNoExt}`;
    }
    const resizedImagesPath = `${imageDirectory}/resized`;
    const resizedFileNamePrefix = `${sanitizedFileName.fileNameNoExt}_thumb@`;
    const resizedFileNameExt = `.${sanitizedFileName.fileExt}`;

    const imageDirectoryData: ImageDirectoryData = {
      imagePath,
      imageDirectory,
      resizedImagesPath,
      resizedFileNamePrefix,
      resizedFileNameExt,
    };

    return imageDirectoryData;

  }

}
