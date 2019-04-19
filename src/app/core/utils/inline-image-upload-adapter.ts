import * as firebase from 'firebase/app';
import { throwError } from 'rxjs';
import { UploadMetadata } from '@angular/fire/storage/interfaces';
import { SanitizedFileName } from '../models/posts/sanitized-file-name.model';
import { PostImageMetadata } from '../models/posts/post-image-metadata.model';
import { ImageType } from '../models/images/image-type.model';
import { Post } from '../models/posts/post.model';
import { FirebasePaths } from '../models/routes-and-paths/firebase-paths.model';

// Adapted from https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html
export class InlineImageUploadAdapter {

  loader;
  postId: string;

  sanitizedFileName: SanitizedFileName;
  imageDirectory: string;

  storageRef = firebase.app().storage(FirebasePaths.BLOG_STORAGE_FB).ref(); // Storage bucket ref
  db = firebase.firestore(); // Firebase database

  imageSizes: number[];


  constructor(loader, postId) {
    this.loader = loader;
    this.postId = postId;
    console.log('Constructing adapter with post id', postId);
  }

  // Starts the upload process.
  async upload() {
    const file = await this.loader.file;

    // Assign the vars that depend on the extracted file
    this.setAdditionalInstanceVars(file);

    return new Promise( async (resolve, reject) => {
      console.log('Detected this file', file);
      const urlObject = await this.uploadInlineImage(file);

      if (!urlObject || urlObject === 'Only image files allowed') {
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

  private uploadInlineImage(file: File): Promise<{}> {
    if (file.type.split('/')[0] !== 'image') {
      return throwError('Only image files allowed').toPromise();
    }

    const path = `${this.imageDirectory}/${this.sanitizedFileName.fullFileName}`;
    const imagePathRef = this.storageRef.child(path);

    const metadata: PostImageMetadata = {
      contentType: file.type,
      customMetadata: {
        postId: this.postId,
        postImageType: ImageType.BLOG_INLINE
      }
    };

    // Need to convert to unkown first to adhere to Firebase api
    const fbFriendlyMetaData: unknown = {
      ...metadata
    };

    const uploadTask = imagePathRef.put(file, fbFriendlyMetaData as UploadMetadata);

    console.log('About to commence upload', imagePathRef, file);


    const urlPromise = new Promise<{}> ( (resolve, reject) => {
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
        const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL()
          .catch(error => console.log(error));
        console.log('File temporarily available at', downloadUrl);
        await this.listenForPostUpdate(this.postId);
        console.log('Post updated, fetching download urls');

        const urlObject = await this.fetchDownloadUrls();
        console.log('Retrieved this url object', urlObject);

        resolve(urlObject);
      });
    });

    return urlPromise;

  }

  private listenForPostUpdate(postId: string): Promise<boolean> {
    console.log('About to listen for post with id', postId);

    const postPromise: Promise<boolean> = new Promise((resolve, reject) => {

      const postListener = this.db.collection('posts').doc(postId)
      .onSnapshot( (doc) => {
        console.log('Current data from post listener: ', doc.data());
        const docData = doc.data() as Post;
        if (docData.imagesUpdated) {
          this.imageSizes = docData.imageSizes;
          this.clearImageSizes(this.postId);
          resolve(true); // Signal next step in logic once resized images have been processed
          postListener(); // Unsubscribe
          console.log('images updated, dbListener unsubscribed');
        }
      }, (error) => {
        console.log('Error getting post snapshot', error);
      });

    });

    return postPromise;

  }

  private async fetchDownloadUrls(): Promise<{}> {

    const resizedImagesPath = `${this.imageDirectory}/resized`;
    const resizedFileNamePrefix = `${this.sanitizedFileName.fileNameNoExt}_thumb@`;
    const resizedFileNameExt = `.${this.sanitizedFileName.fileExt}`;

    // Generate a set of image paths based on imageSizes
    const imagePathKeyPairs = [];
    this.imageSizes.map(size => {
      const pathdict = {[size]: `${resizedImagesPath}/${resizedFileNamePrefix}${size}${resizedFileNameExt}`};
      imagePathKeyPairs.push(pathdict);
    });
    console.log('Image paths retrieved', imagePathKeyPairs);

    this.storeImagePaths(imagePathKeyPairs);

    // Get download urls and map them to their size key
    const imageUrls: Promise<{}> = imagePathKeyPairs.reduce(async (acc: Promise<{}>, dict) => {
      // This collection is required to resolve the acc promise in the async
      const collection: {} = await acc;

      // Get the dict key
      const keyArray = Object.keys(dict);
      const key = keyArray[0];
      const filePath = dict[key];

      console.log('Fetching file with this path', filePath);
      const url: string = await this.storageRef.child(filePath).getDownloadURL()
        .catch(error => console.log(error));
      console.log('Url retreivied', url);
      collection[key] = url;
      return collection;
    }, Promise.resolve([]));

    const urlsNoDefault = await imageUrls;

    const urlsWithDefault = this.insertDefaultUrl(urlsNoDefault);



    return urlsWithDefault;
  }

  private async clearImageSizes(postId: string) {

    this.db.collection('posts').doc(postId).update(
      {
        imageSizes: null,
        imagesUpdated: null,
      }
    );
    console.log('Post image data cleared');
  }

  private insertDefaultUrl(imageUrls): {} {

    // Get the largest image size
    const keyArray = Object.keys(imageUrls);
    keyArray.sort((a, b) => Number(a)  - Number(b)); // Ensure largest key is at end
    const largestKey = keyArray[keyArray.length - 1];

    // Insert it into the object as default
    const updatedObject = {...imageUrls};
    const defaultKey = 'default';
    updatedObject[defaultKey] = imageUrls[largestKey];
    console.log('Updated object with default added', updatedObject);
    return updatedObject;
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

  private setAdditionalInstanceVars(file: File) {
    this.sanitizedFileName = this.sanitizeFileName(file);
    this.imageDirectory = `posts/${this.postId}/${this.sanitizedFileName.fileNameNoExt}`;
  }

  private async storeImagePaths(pathKeyPairArray) {

    // Isolate image urls and assign paths
    const imagePaths: string[] = pathKeyPairArray.map(keyPair => {
      const key = Object.keys(keyPair)[0];
      const path = keyPair[key];
      return path;
    });

    console.log('Image paths to add to post doc', imagePaths);

    const postRef = this.db.collection('posts').doc(this.postId);
    const postDoc = await postRef.get();
    const post = postDoc.data();

    let existingList: string[] = [];
    if (post.imageFilePathList) {
      console.log('Existing image files detected on post');
      existingList = existingList.concat(post.imageFilePathList);
    }
    const updatedList = existingList.concat(imagePaths);
    const dedupedList = [...Array.from(new Set(updatedList))];
    console.log('Deduped updated file list', dedupedList);

    postRef.update({
      imageFilePathList: dedupedList
    });

  }

}
