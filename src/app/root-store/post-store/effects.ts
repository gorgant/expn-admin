import { Injectable, inject } from "@angular/core";
import { FirebaseError } from "@angular/fire/app";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, concatMap, map, switchMap } from "rxjs/operators";
import * as PostStoreActions from './actions';
import { PostService } from "../../core/services/post.service";
import { ImageService } from "../../core/services/image.service";

@Injectable()
export class PostStoreEffects {

  private actions$ = inject(Actions);
  private imageService = inject(ImageService);
  private postService = inject(PostService);

  constructor() { }

  createPostEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.createPostRequested),
      concatMap(action => 
        this.postService.createPost(action.post).pipe(
          map(post => {
            return PostStoreActions.createPostCompleted({post});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.createPostFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  createPostBoilerplateEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.createPostBoilerplateRequested),
      concatMap(action => 
        this.postService.createPostBoilerplate(action.postBoilerplateContent).pipe(
          map(postBoilerplateData => {
            return PostStoreActions.createPostBoilerplateCompleted({postBoilerplateData});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.createPostBoilerplateFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  deletePostEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.deletePostRequested),
      concatMap(action => 
        this.postService.deletePost(action.postId).pipe(
          map(postId => {
            return PostStoreActions.deletePostCompleted({postId});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.deletePostFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  fetchPostBoilerplateEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.fetchPostBoilerplateRequested),
      switchMap(action => 
        this.postService.fetchPostBoilerplate().pipe(
          map(postBoilerplateData => {
            return PostStoreActions.fetchPostBoilerplateCompleted({postBoilerplateData});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.fetchPostBoilerplateFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  fetchSinglePostEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.fetchSinglePostRequested),
      switchMap(action => 
        this.postService.fetchSinglePost(action.postId).pipe(
          map(post => {
            return PostStoreActions.fetchSinglePostCompleted({post});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.fetchSinglePostFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  publishPostEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.publishPostRequested),
      concatMap(action => 
        this.postService.publishPost(action.postId).pipe(
          map(postId => {
            return PostStoreActions.publishPostCompleted({postId});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.publishPostFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  resizePostImageEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.resizePostImageRequested),
      concatMap(action => 
        this.imageService.resizePostImage(action.postImageMetadata).pipe(
          map(postHeroImageData => {
            return PostStoreActions.resizePostImageCompleted({postHeroImageData});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.resizePostImageFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  toggleFeaturedPostEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.toggleFeaturedPostRequested),
      concatMap(action => 
        this.postService.toggleFeaturedPost(action.postId).pipe(
          map(postId => {
            return PostStoreActions.toggleFeaturedPostCompleted({postId});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.toggleFeaturedPostFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  unpublishPostEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.unpublishPostRequested),
      concatMap(action => 
        this.postService.unpublishPost(action.postId).pipe(
          map(postId => {
            return PostStoreActions.unpublishPostCompleted({postId});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.unpublishPostFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  updatePostBoilerplateEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.updatePostBoilerplateRequested),
      concatMap(action => 
        this.postService.updatePostBoilerplate(action.postBoilerplateUpdates).pipe(
          map(postBoilerplateUpdates => {
            return PostStoreActions.updatePostBoilerplateCompleted({postBoilerplateUpdates});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.updatePostBoilerplateFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  updatePostEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.updatePostRequested),
      concatMap(action => 
        this.postService.updatePost(action.postUpdates).pipe(
          map(postUpdates => {
            return PostStoreActions.updatePostCompleted({postUpdates});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.updatePostFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  uploadPostImageEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PostStoreActions.uploadPostImageRequested),
      concatMap(action => 
        this.imageService.uploadPostImageAndGetDownloadUrl(action.postImageResizeData).pipe(
          map(postImageDownloadUrl => {
            return PostStoreActions.uploadPostImageCompleted({postImageDownloadUrl});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PostStoreActions.uploadPostImageFailed({error: fbError}));
          })
        )
      ),
    ),
  );

}