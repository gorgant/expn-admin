import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as postFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap, tap } from 'rxjs/operators';
import { PostService } from 'src/app/core/services/post.service';
import { Post } from 'src/app/core/models/posts/post.model';
import { Update } from '@ngrx/entity';

@Injectable()
export class PostStoreEffects {
  constructor(
    private postService: PostService,
    private actions$: Actions,
  ) { }

  @Effect()
  singlePostRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.SinglePostRequested>(
      postFeatureActions.ActionTypes.SINGLE_POST_REQUESTED
    ),
    mergeMap(action =>
      this.postService.fetchSinglePost(action.payload.postId)
        .pipe(
          map(post => new postFeatureActions.SinglePostLoaded({ post })),
          catchError(error => {
            return of(new postFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  allPostsRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.AllPostsRequested>(
      postFeatureActions.ActionTypes.ALL_POSTS_REQUESTED
    ),
    switchMap(action =>
      this.postService.fetchAllPosts()
        .pipe(
          map(posts => new postFeatureActions.AllPostsLoaded({ posts })),
          catchError(error => {
            return of(new postFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  addPostEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.AddPostRequested>(
      postFeatureActions.ActionTypes.ADD_POST_REQUESTED
    ),
    mergeMap(action => this.postService.createPost(action.payload.post).pipe(
      map(post => {
        return new postFeatureActions.AddPostComplete({post});
      }),
      catchError(error => {
        return of(new postFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  deletePostEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.DeletePostRequested>(
      postFeatureActions.ActionTypes.DELETE_POST_REQUESTED
    ),
    switchMap(action => this.postService.deletePost(action.payload.postId)
      .pipe(
          map(postId => new postFeatureActions.DeletePostComplete({postId})),
          catchError(error => {
            return of(new postFeatureActions.LoadErrorDetected({ error }));
          })
        )
    ),
  );

  @Effect()
  updatePostEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.UpdatePostRequested>(
      postFeatureActions.ActionTypes.UPDATE_POST_REQUESTED
    ),
    switchMap(action => this.postService.updatePost(action.payload.post)
      .pipe(
          map(post => {
            const postUpdate: Update<Post> = {
              id: post.id,
              changes: post
            };
            return new postFeatureActions.UpdatePostComplete({ post: postUpdate });
          }),
          catchError(error => {
            return of(new postFeatureActions.LoadErrorDetected({ error }));
          })
        )
    ),
  );



}
