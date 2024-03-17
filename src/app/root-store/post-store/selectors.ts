import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { PostState } from "./state";
import { AdminStoreFeatureKeys } from "../../../../shared-models/store/feature-keys.model";
import { Post } from "../../../../shared-models/posts/post.model";

const selectPostState = createFeatureSelector<PostState>(AdminStoreFeatureKeys.POST);

const getCreatePostError = (state: PostState) => state.createPostError;
const getCreatePostProcessing = (state: PostState) => state.createPostProcessing;
const getCreatePostBoilerplateError = (state: PostState) => state.createPostBoilerplateError;
const getCreatePostBoilerplateProcessing = (state: PostState) => state.createPostBoilerplateProcessing;
const getDeletePostError = (state: PostState) => state.deletePostError;
const getDeletePostProcessing = (state: PostState) => state.deletePostProcessing;
const getFetchPostBoilerplateError = (state: PostState) => state.fetchPostBoilerplateError;
const getFetchPostBoilerplateProcessing = (state: PostState) => state.fetchPostBoilerplateProcessing;
const getFetchSinglePostError = (state: PostState) => state.fetchSinglePostError;
const getFetchSinglePostProcessing = (state: PostState) => state.fetchSinglePostProcessing;
const getPostBoilerplateData = (state: PostState) => state.postBoilerplateData;
const getPostImageDownloadUrl = (state: PostState) => state.postImageDownloadUrl;
const getPublishPostError = (state: PostState) => state.publishPostError;
const getPublishPostProcessing = (state: PostState) => state.publishPostProcessing;
const getResizePostImageError = (state: PostState) => state.resizePostImageError;
const getResizePostImageProcessing = (state: PostState) => state.resizePostImageProcessing;
const getResizePostImageSucceeded = (state: PostState) => state.postHeroImageData;
const getToggleFeaturedPostError = (state: PostState) => state.toggleFeaturedPostError;
const getToggleFeaturedPostProcessing = (state: PostState) => state.toggleFeaturedPostProcessing;
const getUnpublishPostError = (state: PostState) => state.unpublishPostError;
const getUnpublishPostProcessing = (state: PostState) => state.unpublishPostProcessing;
const getUpdatePostBoilerplateError = (state: PostState) => state.updatePostBoilerplateError;
const getUpdatePostBoilerplateProcessing = (state: PostState) => state.updatePostBoilerplateProcessing;
const getUpdatePostError = (state: PostState) => state.updatePostError;
const getUpdatePostProcessing = (state: PostState) => state.updatePostProcessing;
const getUploadPostImageError = (state: PostState) => state.uploadPostImageError;
const getUploadPostImageProcessing = (state: PostState) => state.uploadPostImageProcessing;

export const selectCreatePostBoilerplateError = createSelector(
  selectPostState,
  getCreatePostBoilerplateError
);

export const selectCreatePostBoilerplateProcessing = createSelector(
  selectPostState,
  getCreatePostBoilerplateProcessing
);

export const selectCreatePostError = createSelector(
  selectPostState,
  getCreatePostError
);

export const selectCreatePostProcessing = createSelector(
  selectPostState,
  getCreatePostProcessing
);

export const selectDeletePostError = createSelector(
  selectPostState,
  getDeletePostError
);

export const selectDeletePostProcessing = createSelector(
  selectPostState,
  getDeletePostProcessing
);

export const selectFetchPostBoilerplateError = createSelector(
  selectPostState,
  getFetchPostBoilerplateError
);

export const selectFetchPostBoilerplateProcessing = createSelector(
  selectPostState,
  getFetchPostBoilerplateProcessing
);

export const selectFetchSinglePostError = createSelector(
  selectPostState,
  getFetchSinglePostError
);

export const selectFetchSinglePostProcessing = createSelector(
  selectPostState,
  getFetchSinglePostProcessing
);

export const selectPostBoilerplateData = createSelector(
  selectPostState,
  getPostBoilerplateData
);

export const selectPostById: (postId: string) => MemoizedSelector<object, Post | undefined> = (postId: string) => createSelector(
  selectPostState,
  postState => postState.entities[postId]
);

export const selectPostImageDownloadUrl = createSelector(
  selectPostState,
  getPostImageDownloadUrl
);

export const selectPublishPostError = createSelector(
  selectPostState,
  getPublishPostError
);

export const selectPublishPostProcessing = createSelector(
  selectPostState,
  getPublishPostProcessing
);

export const selectResizePostImageError = createSelector(
  selectPostState,
  getResizePostImageError
);

export const selectResizePostImageProcessing = createSelector(
  selectPostState,
  getResizePostImageProcessing
);

export const selectResizePostImageSucceeded = createSelector(
  selectPostState,
  getResizePostImageSucceeded
);

export const selectToggleFeaturedPostError = createSelector(
  selectPostState,
  getToggleFeaturedPostError
);

export const selectToggleFeaturedPostProcessing = createSelector(
  selectPostState,
  getToggleFeaturedPostProcessing
);

export const selectUnpublishPostError = createSelector(
  selectPostState,
  getUnpublishPostError
);

export const selectUnpublishPostProcessing = createSelector(
  selectPostState,
  getUnpublishPostProcessing
);

export const selectUpdatePostBoilerplateError = createSelector(
  selectPostState,
  getUpdatePostBoilerplateError
);

export const selectUpdatePostBoilerplateProcessing = createSelector(
  selectPostState,
  getUpdatePostBoilerplateProcessing
);

export const selectUpdatePostError = createSelector(
  selectPostState,
  getUpdatePostError
);

export const selectUpdatePostProcessing = createSelector(
  selectPostState,
  getUpdatePostProcessing
);

export const selectUploadPostImageError = createSelector(
  selectPostState,
  getUploadPostImageError
);

export const selectUploadPostImageProcessing = createSelector(
  selectPostState,
  getUploadPostImageProcessing
);