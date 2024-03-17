import { Injectable, inject } from '@angular/core';
import { Timestamp, collection, doc, docData, DocumentReference, CollectionReference, Firestore, setDoc } from '@angular/fire/firestore';
import { UiService } from './ui.service';
import { Observable, Subject, catchError, from, map, shareReplay, take, takeUntil, throwError } from 'rxjs';
import { Post, PostKeys } from '../../../../shared-models/posts/post.model';
import { SharedCollectionPaths } from '../../../../shared-models/routes-and-paths/fb-collection-paths.model';
import { AuthService } from './auth.service';
import { Update } from '@ngrx/entity';
import { Functions, httpsCallableData } from '@angular/fire/functions';
import { AdminFunctionNames } from '../../../../shared-models/routes-and-paths/fb-function-names.model';
import { HelperService } from './helpers.service';
import { GoogleCloudFunctionsTimestamp } from '../../../../shared-models/firestore/google-cloud-functions-timestamp.model';
import { POST_BOILERPLATE_DOCUMENT_ID, PostBoilerplate, PostBoilerplateKeys } from '../../../../shared-models/posts/post-boilerplate.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private deletePostTriggered$: Subject<void> = new Subject();

  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private functions = inject(Functions);
  private uiService = inject(UiService);
  private helperService = inject(HelperService);

  constructor() { }

  createPost(post: Post): Observable<Post> {
    console.log('createPost call registered');
    const createPostHttpCall: (postData: Post) => 
      Observable<Post> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_CREATE_POST);

    return createPostHttpCall(post)
      .pipe(
        take(1),
        map(serverPost => {
          console.log(`Post created`, serverPost);
          const formattedPost: Post = {
            ...serverPost,
            [PostKeys.CREATED_TIMESTAMP]: this.helperService.convertGoogleCloudTimestampToMs(serverPost[PostKeys.CREATED_TIMESTAMP] as GoogleCloudFunctionsTimestamp),
            [PostKeys.LAST_MODIFIED_TIMESTAMP]: this.helperService.convertGoogleCloudTimestampToMs(serverPost[PostKeys.LAST_MODIFIED_TIMESTAMP] as GoogleCloudFunctionsTimestamp),
          };
          return formattedPost;
        }),
        catchError(error => {
          console.log('Error creating post', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  createPostBoilerplate(postBoilerplateContent: string): Observable<PostBoilerplate> {
    const currentTimeTimestamp: Timestamp = Timestamp.now();

    const formattedPostBoilerplateWithTimestamps: PostBoilerplate = {
      [PostBoilerplateKeys.CONTENT]: postBoilerplateContent,
      [PostBoilerplateKeys.CREATED_TIMESTAMP]: currentTimeTimestamp,
      [PostBoilerplateKeys.ID]: POST_BOILERPLATE_DOCUMENT_ID,
      [PostBoilerplateKeys.LAST_MODIFIED_TIMESTAMP]: currentTimeTimestamp,
    };

    const formattedPostBoilerplateWithMs: PostBoilerplate = {
      [PostBoilerplateKeys.CONTENT]: postBoilerplateContent,
      [PostBoilerplateKeys.CREATED_TIMESTAMP]: currentTimeTimestamp.toMillis(),
      [PostBoilerplateKeys.ID]: POST_BOILERPLATE_DOCUMENT_ID,
      [PostBoilerplateKeys.LAST_MODIFIED_TIMESTAMP]: currentTimeTimestamp.toMillis(),
    };

    const postBoilerplateDocRef = this.getPostBoilerplateDoc();
    const postBoilerplateAddRequest = setDoc(postBoilerplateDocRef, formattedPostBoilerplateWithTimestamps);

    return from(postBoilerplateAddRequest)
      .pipe(
        // If logged out, this triggers unsub of this observable
        takeUntil(this.authService.unsubTrigger$),
        map(empty => {
          console.log(`Created postBoilerplate`, formattedPostBoilerplateWithMs);
          return formattedPostBoilerplateWithMs;
        }),
        catchError(error => {
          this.uiService.showSnackBar(error.message, 10000);
          console.log(`Error creating postBoilerplate`, error);
          return throwError(() => new Error(error));
        })
      );
  }

  deletePost(postId: string): Observable<string> {
    console.log('deletePost call registered');
    const deletePostHttpCall: (postId: string) => 
      Observable<void> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_DELETE_POST);

    this.triggerDeletePostObserver();

    return deletePostHttpCall(postId)
      .pipe(
        take(1),
        map(empty => {
          console.log(`Post deleted`, postId);
          this.uiService.showSnackBar(`Post deleted!`, 5000); // Normally this goes in the component but the component gets destroyed before then so we trigger here instead
          return postId;
        }),
        catchError(error => {
          console.log('Error deleting post', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  

  fetchPostBoilerplate(): Observable<PostBoilerplate> {
    const postBoilerplateDocRef = this.getPostBoilerplateDoc();
    const postBoilerplateDoc = docData(postBoilerplateDocRef);

    return postBoilerplateDoc
      .pipe(
        map(postBoilerplate => {
          if (!postBoilerplate) {
            throw new Error(`Error fetching postBoilerplate with id: ${POST_BOILERPLATE_DOCUMENT_ID}`);
          }
          
          const formattedPostBoilerplate: PostBoilerplate = {
            ...postBoilerplate,
            [PostBoilerplateKeys.CREATED_TIMESTAMP]: (postBoilerplate[PostBoilerplateKeys.CREATED_TIMESTAMP] as Timestamp).toMillis(),
            [PostBoilerplateKeys.LAST_MODIFIED_TIMESTAMP]: (postBoilerplate[PostBoilerplateKeys.LAST_MODIFIED_TIMESTAMP] as Timestamp).toMillis(),
          };
          console.log(`Fetched postBoilerplate`, formattedPostBoilerplate);
          return formattedPostBoilerplate;
        }),
        shareReplay(),
        catchError(error => {
          this.uiService.showSnackBar(error.message, 10000);
          console.log(`Error fetching postBoilerplate`, error);
          return throwError(() => new Error(error));
        })
      );
  }

  fetchSinglePost(postId: string): Observable<Post> {
    const postDocRef = this.getPostDoc(postId);
    const postDoc = docData(postDocRef);

    return postDoc
      .pipe(
        takeUntil(this.deletePostTriggered$),
        map(post => {
          if (!post) {
            throw new Error(`Error fetching post with id: ${postId}`);
          }
          const formattedPost: Post = {
            ...post,
            [PostKeys.CREATED_TIMESTAMP]: (post[PostKeys.CREATED_TIMESTAMP] as Timestamp).toMillis(),
            [PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP]: post[PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP] ? (post[PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP] as Timestamp).toMillis() : null,
            [PostKeys.LAST_MODIFIED_TIMESTAMP]: (post[PostKeys.LAST_MODIFIED_TIMESTAMP] as Timestamp).toMillis(),
            [PostKeys.PUBLISHED_TIMESTAMP]: post[PostKeys.PUBLISHED_TIMESTAMP] ? (post[PostKeys.PUBLISHED_TIMESTAMP] as Timestamp).toMillis() : null,
            [PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP]: post[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP] ? (post[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP] as Timestamp).toMillis() : null,
          };
          console.log(`Fetched single post`, formattedPost);
          return formattedPost;
        }),
        shareReplay(),
        catchError(error => {
          this.uiService.showSnackBar(error.message, 10000);
          console.log(`Error fetching post`, error);
          return throwError(() => new Error(error));
        })
      );
  }

  publishPost(postId: string): Observable<string> {
    console.log('publishPost call registered');
    const publishPostHttpCall: (postIdString: string) => 
      Observable<void> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_PUBLISH_POST);

    return publishPostHttpCall(postId)
      .pipe(
        take(1),
        map(empty => {
          console.log(`Post published`, postId);
          return postId;
        }),
        catchError(error => {
          console.log('Error publishing post', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  toggleFeaturedPost(postId: string): Observable<string> {
    console.log('toggleFeaturedPost call registered');
    const toggleFeaturedPostHttpCall: (postIdString: string) => 
      Observable<void> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_TOGGLE_FEATURED_POST);

    return toggleFeaturedPostHttpCall(postId)
      .pipe(
        take(1),
        map(empty => {
          console.log(`Featured post toggled`, postId);
          return postId;
        }),
        catchError(error => {
          console.log('Error toggling featured post', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  unpublishPost(postId: string): Observable<string> {
    console.log('unpublishPost call registered');
    const unpublishPostHttpCall: (postId: string) => 
      Observable<void> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_UNPUBLISH_POST);

    return unpublishPostHttpCall(postId)
      .pipe(
        take(1),
        map(empty => {
       
          console.log(`Post unpublished`, postId);
          return postId;
        }),
        catchError(error => {
          console.log('Error unpublishing post', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  updatePost(postUpdates: Post): Observable<Update<Post>> {
    console.log('updatePost call registered');
    const updatePostHttpCall: (postData: Post) => 
      Observable<Post> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_UPDATE_POST);

    return updatePostHttpCall(postUpdates)
      .pipe(
        take(1),
        map(serverPost => {
          console.log(`Post updated`, serverPost);
          const formattedServerPost: Post = {
            ...serverPost,
            [PostKeys.CREATED_TIMESTAMP]: this.helperService.convertGoogleCloudTimestampToMs(serverPost[PostKeys.CREATED_TIMESTAMP] as GoogleCloudFunctionsTimestamp),
            [PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP]: serverPost[PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP] ? this.helperService.convertGoogleCloudTimestampToMs(serverPost[PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP] as GoogleCloudFunctionsTimestamp) : null,
            [PostKeys.LAST_MODIFIED_TIMESTAMP]: this.helperService.convertGoogleCloudTimestampToMs(serverPost[PostKeys.LAST_MODIFIED_TIMESTAMP] as GoogleCloudFunctionsTimestamp),
            [PostKeys.PUBLISHED_TIMESTAMP]: serverPost[PostKeys.PUBLISHED_TIMESTAMP] ? this.helperService.convertGoogleCloudTimestampToMs(serverPost[PostKeys.PUBLISHED_TIMESTAMP] as GoogleCloudFunctionsTimestamp) : null,
            [PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP]: serverPost[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP] ? this.helperService.convertGoogleCloudTimestampToMs(serverPost[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP] as GoogleCloudFunctionsTimestamp) : null,
          };

          const updatedPost: Update<Post> = {
            id: serverPost[PostKeys.ID],
            changes: {
              ...formattedServerPost
            }            
          };

          return updatedPost;
        }),
        catchError(error => {
          console.log('Error updating post', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  updatePostBoilerplate(postBoilerplateUpdates: PostBoilerplate): Observable<PostBoilerplate> {
    console.log('updatePostBoilerplate call registered');
    const updatePostBoilerplateHttpCall: (postBoilerplateData: PostBoilerplate) => 
      Observable<PostBoilerplate> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_UPDATE_POST_BOILERPLATE);

    return updatePostBoilerplateHttpCall(postBoilerplateUpdates)
      .pipe(
        take(1),
        map(serverPostBoilerplate => {
          console.log(`PostBoilerplate updated`, serverPostBoilerplate);
          const formattedServerPostBoilerplate: PostBoilerplate = {
            ...serverPostBoilerplate,
            [PostBoilerplateKeys.CREATED_TIMESTAMP]: this.helperService.convertGoogleCloudTimestampToMs(serverPostBoilerplate[PostBoilerplateKeys.CREATED_TIMESTAMP] as GoogleCloudFunctionsTimestamp),
            [PostBoilerplateKeys.LAST_MODIFIED_TIMESTAMP]: this.helperService.convertGoogleCloudTimestampToMs(serverPostBoilerplate[PostBoilerplateKeys.LAST_MODIFIED_TIMESTAMP] as GoogleCloudFunctionsTimestamp),
          };

          return formattedServerPostBoilerplate;
        }),
        catchError(error => {
          console.log('Error updating postBoilerplate', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  private triggerDeletePostObserver() {
    this.deletePostTriggered$.next(); // Send signal to Firebase subscriptions to unsubscribe
    this.deletePostTriggered$.complete(); // Send signal to Firebase subscriptions to unsubscribe
    this.deletePostTriggered$ = new Subject<void>(); // Reinitialize the unsubscribe subject in case page isn't refreshed after logout (which means auth wouldn't reset)
  }



  private getPostCollection(): CollectionReference<Post> {
    return collection(this.firestore, SharedCollectionPaths.POSTS) as CollectionReference<Post>;
  }

  private getPostDoc(postId: string): DocumentReference<Post> {
    return doc(this.getPostCollection(), postId);
  }

  private generateNewPostDocumentId(): string {
    return doc(this.getPostCollection()).id;
  }

  private getSharedResourcesCollection(): CollectionReference<any> {
    return collection(this.firestore, SharedCollectionPaths.SHARED_RESOURCES) as CollectionReference<any>;
  }

  private getPostBoilerplateDoc(): DocumentReference<PostBoilerplate> {
    return doc(this.getSharedResourcesCollection(), POST_BOILERPLATE_DOCUMENT_ID);
  }

}
