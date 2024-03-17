import { createAction, props } from "@ngrx/store";
import { Post, PostHeroImageData } from "../../../../shared-models/posts/post.model";
import { FirebaseError } from "@angular/fire/app";
import { Update } from "@ngrx/entity";
import { PostImageResizeData } from "../../../../shared-models/images/post-image-data.model";
import { PostImageMetadata } from "../../../../shared-models/images/image-metadata.model";
import { PostBoilerplate } from "../../../../shared-models/posts/post-boilerplate.model";

// Create Post

export const createPostRequested = createAction(
  '[Edit Post] Create Post Requested',
  props<{post: Post}>()
);

export const createPostCompleted = createAction(
  '[Post Service] Create Post Completed',
  props<{post: Post}>()
);

export const createPostFailed = createAction(
  '[Post Service] Create Post Failed',
  props<{error: FirebaseError}>()
);

// Create Post Boilerplate

export const createPostBoilerplateRequested = createAction(
  '[Edit Post] Create Post Boilerplate Requested',
  props<{postBoilerplateContent: string}>()
);

export const createPostBoilerplateCompleted = createAction(
  '[Post Service] Create Post Boilerplate Completed',
  props<{postBoilerplateData: PostBoilerplate}>()
);

export const createPostBoilerplateFailed = createAction(
  '[Post Service] Create Post Boilerplate Failed',
  props<{error: FirebaseError}>()
);

// Delete Post

export const deletePostRequested = createAction(
  '[Edit Post] Delete Post Requested',
  props<{postId: string}>()
);

export const deletePostCompleted = createAction(
  '[Post Service] Delete Post Completed',
  props<{postId: string}>()
);

export const deletePostFailed = createAction(
  '[Post Service] Delete Post Failed',
  props<{error: FirebaseError}>()
);

// Fetch Post Boilerplate

export const fetchPostBoilerplateRequested = createAction(
  '[Edit Post] Fetch PostBoilerplate Requested',
);

export const fetchPostBoilerplateCompleted = createAction(
  '[Post Service] Fetch PostBoilerplate Completed',
  props<{postBoilerplateData: PostBoilerplate}>()
);

export const fetchPostBoilerplateFailed = createAction(
  '[Post Service] Fetch PostBoilerplate Failed',
  props<{error: FirebaseError}>()
);

// Fetch Single Post

export const fetchSinglePostRequested = createAction(
  '[Post Component] Fetch Single Post Requested',
  props<{postId: string}>()
);

export const fetchSinglePostCompleted = createAction(
  '[Post Service] Fetch Single Post Completed',
  props<{post: Post}>()
);

export const fetchSinglePostFailed = createAction(
  '[Post Service] Fetch Single Post Failed',
  props<{error: FirebaseError}>()
);

// Publish Post

export const publishPostRequested = createAction(
  '[Blog Dashboard] Publish Post Requested',
  props<{postId: string}>()
);

export const publishPostCompleted = createAction(
  '[Post Service] Publish Post Completed',
  props<{postId: string}>()
);

export const publishPostFailed = createAction(
  '[Post Service] Publish Post Failed',
  props<{error: FirebaseError}>()
);

// Purge Post Image Data

export const purgePostImageData = createAction(
  '[Image Uploader] Purge Post Image Data'
);

// Purge Post State

export const purgePostState = createAction(
  '[AppWide] Purge Post State'
);

// Purge Post State Errors

export const purgePostStateErrors = createAction(
  '[AppWide] Purge Post State Errors'
);

// Resize Post Image Requested

export const resizePostImageRequested = createAction(
  '[Image Uploader] resizePostImage Requested',
  props<{postImageMetadata: PostImageMetadata}>()
);

export const resizePostImageCompleted = createAction(
  '[Image Service] resizePostImage Completed',
  props<{postHeroImageData: PostHeroImageData}>()
);

export const resizePostImageFailed = createAction(
  '[Image Service] resizePostImage Failed',
  props<{error: FirebaseError}>()
);

// Toggle Featured Post

export const toggleFeaturedPostRequested = createAction(
  '[Blog Dashboard] Toggle Featured Post Requested',
  props<{postId: string}>()
);

export const toggleFeaturedPostCompleted = createAction(
  '[Post Service] Toggle Featured Post Completed',
  props<{postId: string}>()
);

export const toggleFeaturedPostFailed = createAction(
  '[Post Service] Toggle Featured Post Failed',
  props<{error: FirebaseError}>()
);

// Unpublish Post

export const unpublishPostRequested = createAction(
  '[Blog Dashboard] Unpublish Post Requested',
  props<{postId: string}>()
);

export const unpublishPostCompleted = createAction(
  '[Post Service] Unpublish Post Completed',
  props<{postId: string}>()
);

export const unpublishPostFailed = createAction(
  '[Post Service] Unpublish Post Failed',
  props<{error: FirebaseError}>()
);

// Update Post

export const updatePostRequested = createAction(
  '[Edit Post] Update Post Requested',
  props<{postUpdates: Post}>()
);

export const updatePostCompleted = createAction(
  '[Post Service] Update Post Completed',
  props<{postUpdates: Update<Post>}>()
);

export const updatePostFailed = createAction(
  '[Post Service] Update Post Failed',
  props<{error: FirebaseError}>()
);

// Update Post Boilerplate

export const updatePostBoilerplateRequested = createAction(
  '[Edit Post] Update PostBoilerplate Requested',
  props<{postBoilerplateUpdates: PostBoilerplate}>()
);

export const updatePostBoilerplateCompleted = createAction(
  '[Post Service] Update PostBoilerplate Completed',
  props<{postBoilerplateUpdates: PostBoilerplate}>()
);

export const updatePostBoilerplateFailed = createAction(
  '[Post Service] Update PostBoilerplate Failed',
  props<{error: FirebaseError}>()
);

// Upload Post Image

export const uploadPostImageRequested = createAction(
  '[Image Uploader] Upload Post Image Requested',
  props<{postImageResizeData: PostImageResizeData}>()
);

export const uploadPostImageCompleted = createAction(
  '[Image Service] Upload Post Image Completed',
  props<{postImageDownloadUrl: string}>()
);

export const uploadPostImageFailed = createAction(
  '[Image Service] Upload Post Image Failed',
  props<{error: FirebaseError}>()
);