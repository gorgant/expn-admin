import { Injectable } from '@angular/core';
import { Subject, throwError, Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { SanitizedFileName } from '../models/images/sanitized-file-name.model';
import { ImageType } from '../models/images/image-type.model';
import { ImageMetadata } from '../models/images/image-metadata.model';
import { map, catchError, takeUntil, take, tap, switchMap } from 'rxjs/operators';
import { UploadMetadata } from '@angular/fire/storage/interfaces';
import { AngularFireStorageReference } from '@angular/fire/storage';
import { PostService } from './post.service';
import { ProductService } from './product.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { Post } from '../models/posts/post.model';
import { Product } from '../models/products/product.model';
import { ImageUrlObject } from '../models/images/image-url-object.model';
import { ImageProps } from '../models/images/image-props.model';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ImageDirectoryData } from '../models/images/image-directory-data.model';

// THIS ONLY WORKS IF USING A SINGLE FIREBASE STORAGE BUCKET
// IF MULTIPLE BUCKETS, USE FIREBASE SDK IN IMAGEFBSERVICE
@Injectable({
  providedIn: 'root'
})
export class DepricatedImageService {

  private imageProcessing$ = new BehaviorSubject<boolean>(false);
  private imageSizesRetrieved$: Subject<number[]> = new Subject();

  constructor(
    private postService: PostService,
    private productService: ProductService,
    private fns: AngularFireFunctions,
  ) { }

  getImageProcessing(): Subject<boolean> {
    return this.imageProcessing$;
  }

  uploadImage(file: File, itemId: string, imageType: ImageType): void {

    this.imageProcessing$.next(true);
    const imageDirectoryData = this.setImageDirectoryData(file, itemId, imageType);
    const path = imageDirectoryData.imagePath;
    const fileRef = this.getItemFileRef(path, imageType);

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

    // Retreive file image sizes
    this.getImageSizes(itemId, imageType)
    .pipe(
      map(imageSizes => {
        console.log('No image sizes detected');
        if (imageSizes) {
          // Signal arrival of image sizes
          console.log('Image sizes retrieved, pinging subject', imageSizes);
          this.imageSizesRetrieved$.next(imageSizes);
        }
      }),
      catchError(error => {
        console.log('Error getting image sizes', error);
        return throwError(error);
      })
    ).subscribe();

    // Upload file to server and trigger cloud function once complete
    fileRef.put(file, fbFriendlyMetaData as UploadMetadata)
    .then(res => {
      console.log('Original image uploaded, triggering cloud function resize');
      this.resizeImagesOnServer(metadata);
    })
    .catch(error => {
      console.log('Error uploading file', error);
    });

  }

  private getImageSizes(itemId: string, imageType: ImageType): Observable<number[]> {

    const itemDoc = this.getItemDoc(itemId, imageType);

    return itemDoc.snapshotChanges()
      .pipe(
        takeUntil(this.imageSizesRetrieved$), // Unsubscribe once data is retrieved
        map(action => {
          console.log('Item doc change detected');
          const item = action.payload.data();
          if (item && item.imagesUpdated) {
            console.log('returning image sizes', item.imageSizes);
            return item.imageSizes;
          }
        }),
        catchError(error => {
          console.log('Error getting image sizes', error);
          return throwError(error);
        })
      );
  }

  private resizeImagesOnServer(metadata: ImageMetadata) {
    const resizeImageHttpCall = this.fns.httpsCallable('resizeImages');

    resizeImageHttpCall(metadata)
      .pipe(
        take(1),
        tap(response => {
          console.log('Resized image url set on product', response);
        }),
        catchError(error => {
          console.log('Error updating product data on server', error);
          return throwError(error);
        })
      ).subscribe();

  }

  // This is the final core operation of image upload
  fetchUpdatedImageProps(file: File, itemId: string, imageType: ImageType): Observable<ImageProps> {
    return this.imageSizesRetrieved$
      .pipe(
        take(1),
        switchMap(imageSizes => {
          // Clear images sizes as they have been retrieved (so available for updates by other images)
          console.log('Images sizes to clear', imageSizes);
          console.log('Item to clear them on', itemId);
          this.clearImageSizes(itemId, imageType);
          console.log('Image sizes received, fetching download urls', imageSizes);
          const urlObject$ = this.fetchImageUrlObject(file, itemId, imageSizes, ImageType.PRODUCT);
          return urlObject$;
        }),
        map(urlObject => {
          const imageProps = this.setImageProps(urlObject); // Update in local memory for when post is created
          this.storeImageProps(itemId, ImageType.PRODUCT, imageProps, ); // Save in database pre- post creation
          console.log('About to parse this set of ulrObjects for default url', urlObject);
          this.imageProcessing$.next(false); // Marks the final core operation of image upload
          return imageProps; // Set for instant UI update
        })
      );
  }

  private clearImageSizes(itemId: string, imageType: ImageType) {
    const itemDoc = this.getItemDoc(itemId, imageType);

    itemDoc.update({
      imageSizes: null,
      imagesUpdated: null
    }).catch(error => {
      console.log('Error clearing images sizes', error);
    });
    console.log('Image data cleared');
  }

  private fetchImageUrlObject(file: File, itemId: string, imageSizes, imageType: ImageType): Observable<ImageUrlObject> {

    const imageDirectoryData = this.setImageDirectoryData(file, itemId, imageType);

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

    this.storeImagePaths(itemId, imagePathKeyPairs, imageType);

    // Collect images into object array using forkJoin
    const urlKeyPairArray$: Observable<[]> = forkJoin(...imagePathKeyPairs.map(
      dict => {
        const keyArray = Object.keys(dict);
        const key = keyArray[0];
        const filePath = dict[key];
        console.log('Fetching file with this path', filePath);

        const fileRef = this.getItemFileRef(filePath, imageType);

        const urlKeyPair = fileRef.getDownloadURL()
          .pipe(
            map(url => {
              return {[key]: url};
            }),
            catchError(error => {
              console.log('Error fetching download url', error);
              return throwError(error);
            })
          );
        return urlKeyPair;
      }
    ));

    return urlKeyPairArray$
      .pipe(
        take(1),
        map(keyPairArray => {
          console.log('mapping this key-pair array', keyPairArray);
          // Convert array to {[size] : url} object
          const urlObject: {} = {};
          keyPairArray.map(object => {
            const keyArray = Object.keys(object);
            const key = keyArray[0];
            const url = object[key];
            urlObject[key] = url;
          });
          const urlsWithDefault = this.insertDefaultUrl(urlObject);
          console.log('Returning url object array');
          return urlsWithDefault;
        }),
        catchError(error => {
          console.log('Error mapping keyPairArray', error);
          return throwError(error);
        })
      );
  }

  // Assign image props values from url object
  private setImageProps(urlObject: ImageUrlObject): ImageProps {

    const defaultImageKey = 'default';

    // Get array of valid keys (excluding default)
    const keyArray = Object.keys(urlObject); // Generate array
    keyArray.sort((a, b) => Number(a)  - Number(b)); // Ensure largest key is at end
    keyArray.pop(); // Remove the default value

    // Identify largest key
    const largestKey = keyArray[keyArray.length - 1];

    // Build array of srcSet attributes
    const srcSetArray = keyArray.map(key => {
      const url: string = urlObject[key];
      const size: string = key;
      const srcSetItem = `${url} ${size}w`;
      return srcSetItem;
    });

    // Build hero image props object
    const src: string = urlObject[defaultImageKey];
    const srcset = srcSetArray.join(', ').toString();
    const sizes = '100vw';
    const width = largestKey.toString();

    const heroImageProps: ImageProps = {
      src,
      srcset,
      sizes,
      width
    };
    console.log('Hero image props', heroImageProps);
    return heroImageProps;
  }

  // Update image props on server
  private storeImageProps(itemId: string, imageType: ImageType, imageProps: ImageProps) {
    const itemDoc = this.getItemDoc(itemId, imageType);

    itemDoc.update({
      imageProps
    }).catch(error => {
      console.log('Error updating image props', error);
    });
    console.log('Url object data stored');
  }

  // Be sure to initiate this before inserting default url into keyPair
  private storeImagePaths(itemId, pathKeyPairArray, imageType: ImageType) {

    // Isolate image urls and assign paths
    const imagePaths: string[] = pathKeyPairArray.map(keyPair => {
      const key = Object.keys(keyPair)[0];
      const path = keyPair[key];
      return path;
    });

    console.log('Image paths to add to item doc', imagePaths);

    // Add image paths to item record
    const itemDoc = this.getItemDoc(itemId, imageType);
    itemDoc.valueChanges()
      .pipe(take(1))
      .subscribe(item => {
        let existingList: string[] = [];
        if (item.imageFilePathList) {
          console.log('Existing image files detected on item');
          existingList = existingList.concat(item.imageFilePathList);
        }
        const updatedList = existingList.concat(imagePaths);
        const dedupedList = [...Array.from(new Set(updatedList))];
        console.log('Deduped updated file list', dedupedList);

        itemDoc.update({
          imageFilePathList: dedupedList
        });
      }, (error) => {
        console.log('Error updating imageFilePathList', error);
      });
  }

  private insertDefaultUrl(imageUrls: {}): ImageUrlObject {

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

  // The following are helper function used in both core functions

  private getItemDoc(itemId: string, imageType: ImageType): AngularFirestoreDocument<Post | Product> {
    switch (imageType) {
      case ImageType.BLOG_HERO || ImageType.BLOG_INLINE:
        return this.postService.getPostDoc(itemId);
      case ImageType.PRODUCT:
        return this.productService.getProductDoc(itemId);
      default: return this.productService.getProductDoc(itemId);
    }

  }

  private getItemFileRef(path: string, imageType: ImageType): AngularFireStorageReference {
    switch (imageType) {
      case ImageType.BLOG_HERO || ImageType.BLOG_INLINE:
        return this.postService.fetchStorageRef(path);
      case ImageType.PRODUCT:
        return this.productService.fetchStorageRef(path);
      default: return this.productService.fetchStorageRef(path);
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
      case ImageType.BLOG_HERO || ImageType.BLOG_INLINE:
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
