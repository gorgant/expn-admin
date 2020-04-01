import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as postFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap, tap } from 'rxjs/operators';
import { PostService } from 'src/app/core/services/post.service';
import { Update } from '@ngrx/entity';
import { RootStoreState } from '..';
import { Post } from 'shared-models/posts/post.model';

@Injectable()
export class PostStoreEffects {
  constructor(
    private postService: PostService,
    private actions$: Actions,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  singlePostRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.SinglePostRequested>(
      postFeatureActions.ActionTypes.SINGLE_POST_REQUESTED
    ),
    mergeMap(action =>
      this.postService.fetchSinglePost(action.payload.postId)
        .pipe(
          map(post => {
            if (!post) {
              throw new Error('Post not found');
            }
            return new postFeatureActions.SinglePostLoaded({ post });
          }),
          catchError(error => {
            return of(new postFeatureActions.LoadFailed({ error }));
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
          map(posts => {
            if (!posts) {
              throw new Error('Posts not found');
            }
            return new postFeatureActions.AllPostsLoaded({ posts });
          }),
          catchError(error => {
            return of(new postFeatureActions.LoadFailed({ error }));
          })
        )
    )
  );

  @Effect()
  deletePostEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.DeletePostRequested>(
      postFeatureActions.ActionTypes.DELETE_POST_REQUESTED
    ),
    switchMap(action => this.postService.deletePost(action.payload.postId)
      .pipe(
          map(postId => {
            if (!postId) {
              throw new Error('Error deleting post');
            }
            return new postFeatureActions.DeletePostComplete({postId});
          }),
          catchError(error => {
            return of(new postFeatureActions.DeleteFailed({ error }));
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
            if (!post) {
              throw new Error('Error updating post');
            }
            const postUpdate: Update<Post> = {
              id: post.id,
              changes: post
            };
            return new postFeatureActions.UpdatePostComplete({ post: postUpdate });
          }),
          catchError(error => {
            return of(new postFeatureActions.SaveFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  togglePublishedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.TogglePublishedRequested>(
      postFeatureActions.ActionTypes.TOGGLE_PUBLISHED_REQUESTED
    ),
    switchMap(action => this.postService.togglePublishPost(action.payload.post)
      .pipe(
          tap(post => {
            if (!post) {
              throw new Error('Error publishing post');
            }
            return this.store$.dispatch(new postFeatureActions.UpdatePostRequested({post}));
          }),
          map(post => new postFeatureActions.TogglePublishedComplete()),
          catchError(error => {
            return of(new postFeatureActions.PublicUpdateFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  toggleFeaturedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.ToggleFeaturedRequested>(
      postFeatureActions.ActionTypes.TOGGLE_FEATURED_REQUESTED
    ),
    switchMap(action => this.postService.togglePostFeatured(action.payload.post)
      .pipe(
          tap(post => {
            if (!post) {
              throw new Error('Error toggling post featured');
            }
            return this.store$.dispatch(new postFeatureActions.UpdatePostRequested({post}));
          }),
          map(post => new postFeatureActions.ToggleFeaturedComplete()),
          catchError(error => {
            return of(new postFeatureActions.PublicUpdateFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  refreshPublicBlogIndexEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.RefreshPublicBlogIndexRequested>(
      postFeatureActions.ActionTypes.REFRESH_PUBLIC_BLOG_INDEX_REQUESTED
    ),
    switchMap(action => this.postService.refreshBlogIndex()
      .pipe(
          map(response => {
            if (!response) {
              throw new Error('Error refreshing blog index');
            }
            return  new postFeatureActions.RefreshPublicBlogIndexComplete();
          }),
          catchError(error => {
            return of(new postFeatureActions.PublicUpdateFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  refreshPublicBlogCacheEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.RefreshPublicBlogCacheRequested>(
      postFeatureActions.ActionTypes.REFRESH_PUBLIC_BLOG_CACHE_REQUESTED
    ),
    switchMap(action => this.postService.refreshBlogCache()
      .pipe(
          map(response => {
            if (!response) {
              throw new Error('Error refreshing blog cache');
            }
            return  new postFeatureActions.RefreshPublicBlogCacheComplete();
          }),
          catchError(error => {
            return of(new postFeatureActions.PublicUpdateFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  refreshPublicFeaturedPostsCacheEffect$: Observable<Action> = this.actions$.pipe(
    ofType<postFeatureActions.RefreshPublicFeaturedPostsCacheRequested>(
      postFeatureActions.ActionTypes.REFRESH_PUBLIC_FEATURED_POSTS_CACHE_REQUESTED
    ),
    switchMap(action => this.postService.refreshFeaturedPostsCache()
      .pipe(
          map(response => {
            if (!response) {
              throw new Error('Error refreshing featured posts cache');
            }
            return  new postFeatureActions.RefreshPublicFeaturedPostsCacheComplete();
          }),
          catchError(error => {
            return of(new postFeatureActions.PublicUpdateFailed({ error }));
          })
        )
    ),
  );



}
