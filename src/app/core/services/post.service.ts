import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map, take, takeUntil, catchError } from 'rxjs/operators';
import { Observable, throwError, from, forkJoin, Subject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadMetadata } from '@angular/fire/storage/interfaces';
import { Post } from '../models/posts/post.model';
import { PostImage } from '../models/posts/post-image.model';
import { PostImageMetadata } from '../models/posts/post-image-metadata.model';
import { PostImageType } from '../models/posts/post-image-type.model';
import { HeroUrlObject } from '../models/posts/hero-url-object.model';
import { HeroImageProps } from '../models/posts/hero-image-props.model';
import { SanitizedFileName } from '../models/posts/sanitized-file-name.model';
import { now } from 'moment';
import { PublicService } from './public.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postsCollection: AngularFirestoreCollection<Post>;
  postDoc: AngularFirestoreDocument<Post>;

  imagesCollection: AngularFirestoreCollection<PostImage>;

  imageSizesRetrieved: Subject<number[]> = new Subject();

  sanitizedFileName: SanitizedFileName;
  imageDirectory: string;



  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private publicService: PublicService
  ) {
    this.postsCollection = this.afs.collection('posts', ref => ref.orderBy('modifiedDate', 'desc'));
   }

  getPosts(): Observable<Post[]> {
    return this.postsCollection.snapshotChanges()
      .pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data() as Post;
              const id = a.payload.doc.id;

              return {...data, id};
            });
          }),
          catchError(error => {
            console.log('Error getting posts', error);
            return throwError(error);
          })
      );
  }

  deletePost(postId: string): void {
    this.deleteAllPostImages(postId); // Be sure to delete images before deleting the post doc
    this.getPostDoc(postId).delete()
      .catch(error => {
        console.log('Error deleting post', error);
      });
  }

  updatePost(postId: string, data: Post): void {
    this.getPostDoc(postId).update(data)
      .catch(error => {
        console.log('Error updating post', error);
      });
  }

  publishPost(post: Post): void {
    const publishedPost: Post = {
      ...post,
      published: true,
      publishedDate: post.publishedDate ? post.publishedDate : now() // Only add publish date if doesn't already exist
    };

    this.getPostDoc(post.id).update(publishedPost)
      .catch(error => {
        console.log('Error publishing post in admin', error);
      });

    this.publicService.updatePublicPost(publishedPost); // Will publish post on public server (because published = true)
  }

  unPublishPost(post: Post): void {

    const unPublishedPost: Post = {
      ...post,
      published: false,
    };

    this.getPostDoc(post.id).update(unPublishedPost)
    .catch(error => {
      console.log('Error updating post', error);
    });

    this.publicService.updatePublicPost(unPublishedPost); // Will delete post on public server (because published = false)
  }

  generateNewPostId(): string {
    return this.afs.createId();
  }

  getPostImages(postId: string): Observable<PostImage[]> {
    return this.getPostDoc(postId).collection('images').snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as PostImage;
            const id = a.payload.doc.id;

            return {...data, id};
          });
        }),
        catchError(error => {
          console.log('Error getting post images', error);
          return throwError(error);
        })
      );
  }


  getPostData(id: string): Observable<Post> {
    this.postDoc = this.getPostDoc(id);
    return this.postDoc.valueChanges();
  }

  initPost(data: Post, postId: string): Observable<Post> {
    const fbResponse = this.postsCollection.doc(postId).set(data)
      .then(empty => {
        return data;
      })
      .catch(error => {
        return throwError(error).toPromise();
      });

    return from(fbResponse);
  }

  uploadHeroImage(file: File, postId: string): void {
    this.sanitizedFileName = this.sanitizeFileName(file);
    this.imageDirectory = `posts/${postId}/${this.sanitizedFileName.fileNameNoExt}`;

    const path = `posts/${postId}/${this.sanitizedFileName.fileNameNoExt}/${this.sanitizedFileName.fullFileName}`;
    const fileRef = this.storage.ref(path);

    const metadata: PostImageMetadata = {
      contentType: file.type,
      customMetadata: {
        postId,
        postImageType: PostImageType.HERO
      }
    };

    // Need to convert to unkown first to adhere to Firebase api
    const fbFriendlyMetaData: unknown = {
      ...metadata
    };

    // Retreive file image sizes
    this.getImageSizes(postId)
      .pipe(
        map(imageSizes => {
          console.log('No image sizes detected');
          if (imageSizes) {
            // Signal arrival of image sizes
            console.log('Image sizes retrieved, pinging subject', imageSizes);
            this.imageSizesRetrieved.next(imageSizes);
          }
        }),
        catchError(error => {
          console.log('Error getting image sizes', error);
          return throwError(error);
        })
      ).subscribe();

    // Upload file to storage
    fileRef.put(file, fbFriendlyMetaData as UploadMetadata)
      .catch(error => {
        console.log('Error uploading file', error);
      });
  }

  fetchHeroUrlObject(postId, imageSizes): Observable<HeroUrlObject> {

    const resizedImagesPath = `${this.imageDirectory}/resized`;
    const resizedFileNamePrefix = `${this.sanitizedFileName.fileNameNoExt}_thumb@`;
    const resizedFileNameExt = `.${this.sanitizedFileName.fileExt}`;

    // Generate a set of image paths based on imageSizes
    const imagePathKeyPairs = [];
    imageSizes.map(size => {
      const pathdict = {[size]: `${resizedImagesPath}/${resizedFileNamePrefix}${size}${resizedFileNameExt}`};
      imagePathKeyPairs.push(pathdict);
    });
    console.log('Image paths retrieved', imagePathKeyPairs);

    this.storeImagePaths(postId, imagePathKeyPairs);

    // Collect images into object array using forkJoin
    const urlKeyPairArray$: Observable<[]> = forkJoin(...imagePathKeyPairs.map(
      dict => {
        const keyArray = Object.keys(dict);
        const key = keyArray[0];
        const filePath = dict[key];
        console.log('Fetching file with this path', filePath);

        const fileRef = this.storage.ref(filePath);

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

  clearImageSizes(postId: string) {
    const postDoc = this.getPostDoc(postId);

    postDoc.update({
      imageSizes: null,
      imagesUpdated: null
    }).catch(error => {
      console.log('Error clearing images sizes', error);
    });
    console.log('Post image data cleared');
  }

  storeHeroImageProps(postId: string, heroImageProps: HeroImageProps) {
    const postDoc = this.getPostDoc(postId);

    postDoc.update({
      heroImageProps
    }).catch(error => {
      console.log('Error updating hero image props', error);
    });
    console.log('Url object data stored');
  }

  setHeroImageProps(urlObject: HeroUrlObject): HeroImageProps {

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

    const heroImageProps: HeroImageProps = {
      src,
      srcset,
      sizes,
      width
    };
    console.log('Hero image props', heroImageProps);
    return heroImageProps;
  }

  getImageSizes(postId): Observable<number[]> {
    return this.getPostDoc(postId).snapshotChanges()
      .pipe(
        takeUntil(this.imageSizesRetrieved), // Unsubscribe once data is retrieved
        map(action => {
          console.log('post doc change detected');
          const data = action.payload.data();
          if (data && data.imagesUpdated) {
            console.log('returning image sizes', data.imageSizes);
            return data.imageSizes;
          }
        }),
        catchError(error => {
          console.log('Error getting image sizes', error);
          return throwError(error);
        })
      );
  }

  private insertDefaultUrl(imageUrls: {}): HeroUrlObject {

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

  private getPostDoc(id: string): AngularFirestoreDocument<Post> {
    return this.afs.doc<Post>(`posts/${id}`);
  }

  private getImagesCollection(postId: string): AngularFirestoreCollection<PostImage> {
    return this.getPostDoc(postId).collection('images');
  }

  private getImageDoc(postId: string, imageId: string): AngularFirestoreDocument<PostImage> {
    return this.getImagesCollection(postId).doc(imageId);
  }

  private getImageData(postId: string, imageId: string): Observable<PostImage> {
    return this.getImageDoc(postId, imageId).valueChanges();
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

  // Be sure to initiate this before inserting default url into keyPair
  private storeImagePaths(postId, pathKeyPairArray) {

    // Isolate image urls and assign paths
    const imagePaths: string[] = pathKeyPairArray.map(keyPair => {
      const key = Object.keys(keyPair)[0];
      const path = keyPair[key];
      return path;
    });

    console.log('Image paths to add to post doc', imagePaths);

    // Add image paths to post record
    const postDoc = this.getPostDoc(postId);
    postDoc.valueChanges()
      .pipe(take(1))
      .subscribe(post => {
        let existingList: string[] = [];
        if (post.imageFilePathList) {
          console.log('Existing image files detected on post');
          existingList = existingList.concat(post.imageFilePathList);
        }
        const updatedList = existingList.concat(imagePaths);
        const dedupedList = [...Array.from(new Set(updatedList))];
        console.log('Deduped updated file list', dedupedList);

        postDoc.update({
          imageFilePathList: dedupedList
        });
      }, (error) => {
        console.log('Error updating imageFilePathList', error);
      });
  }

  private deleteAllPostImages(postId: string) {
    const postDoc = this.getPostDoc(postId);
    let imageCount = 0;

    postDoc.valueChanges()
      .pipe(take(1))
      .subscribe(post => {
        if ( post.imageFilePathList) {
          const imagePathList = post.imageFilePathList;
          imageCount = imagePathList.length;
          imagePathList.map(path => {
            const fileRef = this.storage.ref(path);
            fileRef.delete()
              .pipe(
                take(1),
                catchError(error => {
                  console.log('Error caught deleting file', error);
                  return throwError(error);
                })
              )
              .subscribe(
                res => res,
                (error) => {
                  console.log('Error deleting file', error);
                }
              );
            console.log('Deleting file', path);
          });
          console.log(`Deleted all ${imageCount} images assocaited with post`);
        } else {
          console.log('No images to delete');
        }
      }, (error) => {
        console.log('Error deleting all post images', error);
      });
  }

}
