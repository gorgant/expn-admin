import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { map, takeUntil, catchError, switchMap, take, tap } from 'rxjs/operators';
import { Observable, throwError, from, of } from 'rxjs';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { now } from 'moment';
import { PublicService } from './public.service';
import { ImageService } from './image.service';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';
import { Post } from 'shared-models/posts/post.model';
import { ImageType } from 'shared-models/images/image-type.model';
import { SharedCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';
import { AdminFunctionNames } from 'shared-models/routes-and-paths/fb-function-names';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private publicService: PublicService,
    private imageService: ImageService,
    private uiService: UiService,
    private authService: AuthService,
    private fns: AngularFireFunctions,
  ) { }

  fetchAllPosts(): Observable<Post[]> {
    const postCollection = this.getPostCollection();
    return postCollection.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(posts => {
          console.log('Fetched all posts', posts);
          return posts;
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          console.log('Error fetching all posts', error);
          return throwError(error);
        })
      );
  }

  fetchSinglePost(id: string): Observable<Post> {
    const postDoc = this.getPostDoc(id);
    return postDoc.valueChanges()
    .pipe(
      take(1), // Prevents load attempts after deletion
      // takeUntil(this.authService.unsubTrigger$),
      map(post => {
        console.log('Fetched this item', post);
        return post;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error fetching single post', error);
        return throwError(error);
      })
    );
  }

  updatePost(post: Post): Observable<Post> {
    const fbResponse = from(this.getPostDoc(post.id).set(post, {merge: true}));

    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('Post updated', post);
        return post;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error updating post', error);
        return throwError(error);
      })
    );
  }

  rollbackPost(post: Post): Observable<Post> {
    const fbResponse = from(this.getPostDoc(post.id).set(post)); // No merge here, to avoid lingering new fields from discarded changes

    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('Post rolled back', post);
        return post;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error updating post', error);
        return throwError(error);
      })
    );
  }

  deletePost(postId: string): Observable<string> {

    // Be sure to delete images before deleting the item doc
    const deleteImageRes = from(this.imageService.deleteAllItemImages(postId, ImageType.BLOG_HERO));

    // First delete doc images from storage, then delete doc itself
    return deleteImageRes.pipe(
      switchMap(empty => {
        return from(this.getPostDoc(postId).delete()).pipe(
          map(empt => postId)
        );
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error deleting post', error);
        return throwError(error);
      })
    );
  }

  // Update post on server (local update happens in store effects)
  togglePublishPost(post: Post): Observable<Post> {
    let updatedPost: Post = {
      ...post
    };
    if (!post.published) {
      updatedPost = {
        ...updatedPost,
        published: true,
        publishedDate: post.publishedDate ? post.publishedDate : now(), // Only add publish date if doesn't already exist
        scheduledPublishTime: null // Clear the scheduled time when published so it doesn't trigger unwanted publish requests
      };
    } else {
      updatedPost = {
        ...updatedPost,
        published: false,
      };
    }

    return this.submitPubPostUpdate(updatedPost);
  }

  togglePostFeatured(post: Post): Observable<Post> {
    let updatedPost: Post = {
      ...post
    };
    if (post.featured) {
      updatedPost = {
        ...updatedPost,
        featured: false
      };
    } else {
      updatedPost = {
        ...updatedPost,
        featured: true
      };
    }

    return this.submitPubPostUpdate(updatedPost);
  }

  private submitPubPostUpdate(updatedPost: Post): Observable<Post> {
    const serverRes = this.publicService.updatePublicPost(updatedPost);

    return serverRes.pipe(
      map(res => {
        console.log('Server call succeded', res);
        return updatedPost;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error updating post on public server', error);
        return throwError(error);
      })
    );
  }

  refreshBlogIndex(): Observable<string> {
    const refreshPublicblogIndexHttpCall = this.fns.httpsCallable(AdminFunctionNames.REFRESH_PUBLIC_BLOG_INDEX);

    return refreshPublicblogIndexHttpCall({})
      .pipe(
        take(1),
        tap(response => console.log('Refresh public blog index complete', response)),
        catchError(error => {
          console.log('Error with refreshPublicBlogIndexHttpCall', error);
          return throwError(error);
        })
      );
  }

  refreshBlogCache(): Observable<string> {
    const refreshPublicBlogCacheHttpCall = this.fns.httpsCallable(AdminFunctionNames.REFRESH_PUBLIC_BLOG_CACHE);

    return refreshPublicBlogCacheHttpCall({})
      .pipe(
        take(1),
        tap(response => console.log('Refresh public blog cache complete', response)),
        catchError(error => {
          console.log('Error with refreshPublicBlogCacheHttpCall', error);
          return throwError(error);
        })
      );
  }

  refreshFeaturedPostsCache(): Observable<string> {
    const refreshPublicFeaturedPostsCacheHttpCall = this.fns.httpsCallable(AdminFunctionNames.REFRESH_PUBLIC_FEATURED_POSTS_CACHE);

    return refreshPublicFeaturedPostsCacheHttpCall({})
      .pipe(
        take(1),
        tap(response => console.log('Refresh public featured posts cache complete', response)),
        catchError(error => {
          console.log('Error with refreshPublicFeaturedPostsCacheHttpCall', error);
          return throwError(error);
        })
      );
  }

  generateNewPostId(): string {
    return this.afs.createId();
  }

  fetchStorageRef(imagePath: string): AngularFireStorageReference {
    return this.storage.ref(imagePath);
  }

  getPostDoc(id: string): AngularFirestoreDocument<Post> {
    return this.getPostCollection().doc(id);
  }

  private getPostCollection(): AngularFirestoreCollection<Post> {
    return this.afs.collection<Post>(SharedCollectionPaths.POSTS);
  }
}
