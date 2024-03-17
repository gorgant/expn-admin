import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { Post, PostHeroImageData } from "../../../../shared-models/posts/post.model";
import { FirebaseError } from "@angular/fire/app";
import { PostBoilerplate } from "../../../../shared-models/posts/post-boilerplate.model";

export const featureAdapter: EntityAdapter<Post> = createEntityAdapter<Post>({
  selectId: (post: Post) => post.id,
});

export interface PostState extends EntityState<Post> {
  createPostBoilerplateError: FirebaseError | Error | null,
  createPostBoilerplateProcessing: boolean,
  createPostError: FirebaseError | Error | null,
  createPostProcessing: boolean,
  deletePostError: FirebaseError | Error | null,
  deletePostProcessing: boolean,
  fetchPostBoilerplateError: FirebaseError | Error | null,
  fetchPostBoilerplateProcessing: boolean,
  fetchSinglePostError: FirebaseError | Error | null,
  fetchSinglePostProcessing: boolean,
  publishPostError: FirebaseError | Error | null,
  publishPostProcessing: boolean,
  resizePostImageError: FirebaseError | Error | null,
  resizePostImageProcessing: boolean,
  toggleFeaturedPostError: FirebaseError | Error | null,
  toggleFeaturedPostProcessing: boolean,
  unpublishPostError: FirebaseError | Error | null,
  unpublishPostProcessing: boolean,
  updatePostBoilerplateError: FirebaseError | Error | null,
  updatePostBoilerplateProcessing: boolean,
  updatePostError: FirebaseError | Error | null,
  updatePostProcessing: boolean,
  uploadPostImageError: FirebaseError | Error | null,
  uploadPostImageProcessing: boolean,

  postBoilerplateData: PostBoilerplate | null,
  postHeroImageData: PostHeroImageData | null,
  postImageDownloadUrl: string | null,
}

export const initialPostState: PostState = featureAdapter.getInitialState(
  {
    backupPostCollectionError: null,
    backupPostCollectionProcessing: false,
    createPostBoilerplateError: null,
    createPostBoilerplateProcessing: false,
    createPostError: null,
    createPostProcessing: false,
    deletePostError: null,
    deletePostProcessing: false,
    fetchPostBoilerplateError: null,
    fetchPostBoilerplateProcessing: false,
    fetchSinglePostError: null,
    fetchSinglePostProcessing: false,
    publishPostError: null,
    publishPostProcessing: false,
    resizePostImageError: null,
    resizePostImageProcessing: false,
    toggleFeaturedPostError: null,
    toggleFeaturedPostProcessing: false,
    unpublishPostError: null,
    unpublishPostProcessing: false,
    updatePostBoilerplateError: null,
    updatePostBoilerplateProcessing: false,
    updatePostError: null,
    updatePostProcessing: false,
    uploadPostImageError: null,
    uploadPostImageProcessing: false,

    postBoilerplateData: null,
    postHeroImageData: null,
    postImageDownloadUrl: null,
  }
);