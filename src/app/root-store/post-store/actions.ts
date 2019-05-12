import { Action } from '@ngrx/store';
import { Post } from 'src/app/core/models/posts/post.model';
import { Update } from '@ngrx/entity';

export enum ActionTypes {
  SINGLE_POST_REQUESTED = '[Posts] Single Post Requested',
  SINGLE_POST_LOADED = '[Posts] Single Post Loaded',
  ALL_POSTS_REQUESTED = '[Posts] All Posts Requested',
  ALL_POSTS_LOADED = '[Posts] All Posts Loaded',
  ADD_POST_REQUESTED = '[Posts] Add Post Requested',
  ADD_POST_COMPLETE = '[Posts] Add Post Complete',
  UPDATE_POST_REQUESTED = '[Posts] Update Post Requested',
  UPDATE_POST_COMPLETE = '[Posts] Update Post Complete',
  DELETE_POST_REQUESTED = '[Posts] Delete Post Requested',
  DELETE_POST_COMPLETE = '[Posts] Delete Post Complete',
  TOGGLE_PUBLISHED_REQUESTED = '[Posts] Toggle Post Published Requested',
  TOGGLE_PUBLISHED_COMPLETE = '[Posts] Toggle Post Published Complete',
  TOGGLE_FEATURED_REQUESTED = '[Posts] Toggle Post Featured Requested',
  TOGGLE_FEATURED_COMPLETE = '[Posts] Toggle Post Featured Complete',
  POST_LOAD_FAILURE = '[Posts] Load Failure',
}

export class SinglePostRequested implements Action {
  readonly type = ActionTypes.SINGLE_POST_REQUESTED;
  constructor(public payload: { postId: string }) {}
}

export class SinglePostLoaded implements Action {
  readonly type = ActionTypes.SINGLE_POST_LOADED;
  constructor(public payload: { post: Post }) {}
}

export class AllPostsRequested implements Action {
  readonly type = ActionTypes.ALL_POSTS_REQUESTED;
}

export class AllPostsLoaded implements Action {
  readonly type = ActionTypes.ALL_POSTS_LOADED;
  constructor(public payload: { posts: Post[] }) {}
}

export class AddPostRequested implements Action {
  readonly type = ActionTypes.ADD_POST_REQUESTED;

  constructor(public payload: { post: Post }) {}
}

export class AddPostComplete implements Action {
  readonly type = ActionTypes.ADD_POST_COMPLETE;

  constructor(public payload: { post: Post }) {}
}

export class UpdatePostRequested implements Action {
  readonly type = ActionTypes.UPDATE_POST_REQUESTED;

  constructor(public payload: { post: Post }) {}
}

export class UpdatePostComplete implements Action {
  readonly type = ActionTypes.UPDATE_POST_COMPLETE;

  constructor(public payload: { post: Update<Post> }) {}
}

export class DeletePostRequested implements Action {
  readonly type = ActionTypes.DELETE_POST_REQUESTED;

  constructor(public payload: { postId: string }) {}
}

export class DeletePostComplete implements Action {
  readonly type = ActionTypes.DELETE_POST_COMPLETE;

  constructor(public payload: {postId: string}) {}
}

export class TogglePublishedRequested implements Action {
  readonly type = ActionTypes.TOGGLE_PUBLISHED_REQUESTED;

  constructor(public payload: { post: Post }) {}
}

export class TogglePublishedComplete implements Action {
  readonly type = ActionTypes.TOGGLE_PUBLISHED_COMPLETE;
}

export class ToggleFeaturedRequested implements Action {
  readonly type = ActionTypes.TOGGLE_FEATURED_REQUESTED;

  constructor(public payload: { post: Post }) {}
}

export class ToggleFeaturedComplete implements Action {
  readonly type = ActionTypes.TOGGLE_FEATURED_COMPLETE;
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.POST_LOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export type Actions =
  SinglePostRequested |
  SinglePostLoaded |
  AllPostsRequested |
  AllPostsLoaded |
  AddPostRequested |
  AddPostComplete |
  UpdatePostRequested |
  UpdatePostComplete |
  DeletePostRequested |
  DeletePostComplete |
  TogglePublishedRequested |
  TogglePublishedComplete |
  ToggleFeaturedRequested |
  ToggleFeaturedComplete |
  LoadErrorDetected
  ;
