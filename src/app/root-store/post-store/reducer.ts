import {
  createReducer,
  on
} from '@ngrx/store';
import * as  PostStoreActions from './actions';
import { featureAdapter, initialPostState } from './state';
import { PostBoilerplate } from '../../../../shared-models/posts/post-boilerplate.model';

export const postStoreReducer = createReducer(
  initialPostState,

  // Create Post

  on(PostStoreActions.createPostRequested, (state, action) => {
    return {
      ...state,
      createPostProcessing: true,
      createPostError: null
    }
  }),
  on(PostStoreActions.createPostCompleted, (state, action) => {
    return featureAdapter.addOne(
      action.post, {
        ...state,
        createPostProcessing: false,
      }
    );
  }),
  on(PostStoreActions.createPostFailed, (state, action) => {
    return {
      ...state,
      createPostProcessing: false,
      createPostError: action.error
    }
  }),

  // Create Post Boilerplate

  on(PostStoreActions.createPostBoilerplateRequested, (state, action) => {
    return {
      ...state,
      createPostBoilerplateProcessing: true,
      createPostBoilerplateError: null,
      postBoilerplateData: null,
    }
  }),
  on(PostStoreActions.createPostBoilerplateCompleted, (state, action) => {
    return {
      ...state,
      createPostBoilerplateProcessing: false,
      createPostBoilerplateError: null,
      postBoilerplateData: action.postBoilerplateData,
    }
  }),
  on(PostStoreActions.createPostBoilerplateFailed, (state, action) => {
    return {
      ...state,
      createPostBoilerplateProcessing: false,
      createPostBoilerplateError: action.error,
      postBoilerplateData: null,
    }
  }),

  // Delete Post

  on(PostStoreActions.deletePostRequested, (state, action) => {
    return {
      ...state,
      deletePostProcessing: true,
      deletePostError: null
    }
  }),
  on(PostStoreActions.deletePostCompleted, (state, action) => {
    return featureAdapter.removeOne(
      action.postId, {
        ...state,
        deletePostProcessing: false,
      }
    );
  }),
  on(PostStoreActions.deletePostFailed, (state, action) => {
    return {
      ...state,
      deletePostProcessing: false,
      deletePostError: action.error
    }
  }),

  // Fetch Post Boilerplate

  on(PostStoreActions.fetchPostBoilerplateRequested, (state, action) => {
    return {
      ...state,
      fetchPostBoilerplateProcessing: true,
      fetchPostBoilerplateError: null,
      postBoilerplateData: null,
    }
  }),
  on(PostStoreActions.fetchPostBoilerplateCompleted, (state, action) => {
    return {
      ...state,
      fetchPostBoilerplateProcessing: false,
      fetchPostBoilerplateError: null,
      postBoilerplateData: action.postBoilerplateData,
    }
  }),
  on(PostStoreActions.fetchPostBoilerplateFailed, (state, action) => {
    return {
      ...state,
      fetchPostBoilerplateProcessing: false,
      fetchPostBoilerplateError: action.error,
      postBoilerplateData: null,
    }
  }),

  // Fetch Single Post

  on(PostStoreActions.fetchSinglePostRequested, (state, action) => {
    return {
      ...state,
      fetchSinglePostProcessing: true,
      fetchSinglePostError: null
    }
  }),
  on(PostStoreActions.fetchSinglePostCompleted, (state, action) => {
    return featureAdapter.upsertOne(
      action.post, {
        ...state,
        fetchSinglePostProcessing: false,  
      }
    );
  }),
  on(PostStoreActions.fetchSinglePostFailed, (state, action) => {
    return {
      ...state,
      fetchSinglePostProcessing: false,
      fetchSinglePostError: action.error
    }
  }),

  // Publish Post

  on(PostStoreActions.publishPostRequested, (state, action) => {
    return {
      ...state,
      publishPostProcessing: true,
      publishPostError: null
    }
  }),

  on(PostStoreActions.publishPostCompleted, (state, action) => {
    return {
      ...state,
      publishPostProcessing: false,
      publishPostError: null
    }
  }),

  on(PostStoreActions.publishPostFailed, (state, action) => {
    return {
      ...state,
      publishPostProcessing: false,
      publishPostError: action.error
    }
  }),

  // Purge Post Image Data

  on(PostStoreActions.purgePostImageData, (state, action) => {
    return {
      ...state,
      postHeroImageData: null,
      postImageDownloadUrl: null
    }
  }),

  // Purge Post State

  on(PostStoreActions.purgePostState, (state, action) => {
    return featureAdapter.removeAll(
      {
        ...state,
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
  }),

  // Purge Post State Errors

  on(PostStoreActions.purgePostStateErrors, (state, action) => {
    return {
      ...state,
      backupPostCollectionError: null,
      createPostBoilerplateError: null,
      createPostError: null,
      deletePostError: null,
      fetchPostBoilerplateError: null,
      fetchSinglePostError: null,
      publishPostError: null,
      resizePostImageError: null,
      toggleFeaturedPostError: null,
      unpublishPostError: null,
      updatePostBoilerplateError: null,
      updatePostError: null,
      uploadPostImageError: null,
    }
  }),

  // Resize Post Image

  on(PostStoreActions.resizePostImageRequested, (state, action) => {
    return {
      ...state,
      resizePostImageProcessing: true,
      resizePostImageError: null,
      postHeroImageData: null
    }
  }),

  on(PostStoreActions.resizePostImageCompleted, (state, action) => {
    return {
      ...state,
      resizePostImageProcessing: false,
      resizePostImageError: null,
      postHeroImageData: action.postHeroImageData
    }
  }),

  on(PostStoreActions.resizePostImageFailed, (state, action) => {
    return {
      ...state,
      resizePostImageProcessing: false,
      resizePostImageError: action.error,
      postHeroImageData: null
    }
  }),    

  // Toggle Featured Post

  on(PostStoreActions.toggleFeaturedPostRequested, (state, action) => {
    return {
      ...state,
      toggleFeaturedPostProcessing: true,
      toggleFeaturedPostError: null
    }
  }),

  on(PostStoreActions.toggleFeaturedPostCompleted, (state, action) => {
    return {
      ...state,
      toggleFeaturedPostProcessing: false,
      toggleFeaturedPostError: null
    }
  }),

  on(PostStoreActions.toggleFeaturedPostFailed, (state, action) => {
    return {
      ...state,
      toggleFeaturedPostProcessing: false,
      toggleFeaturedPostError: action.error
    }
  }),  

  // Unpublish Post

  on(PostStoreActions.unpublishPostRequested, (state, action) => {
    return {
      ...state,
      unpublishPostProcessing: true,
      unpublishPostError: null
    }
  }),

  on(PostStoreActions.unpublishPostCompleted, (state, action) => {
    return {
      ...state,
      unpublishPostProcessing: false,
      unpublishPostError: null
    }
  }),

  on(PostStoreActions.unpublishPostFailed, (state, action) => {
    return {
      ...state,
      unpublishPostProcessing: false,
      unpublishPostError: action.error
    }
  }),

  // Update Post

  on(PostStoreActions.updatePostRequested, (state, action) => {
    return {
      ...state,
      updatePostProcessing: true,
      updatePostError: null
    }
  }),
  on(PostStoreActions.updatePostCompleted, (state, action) => {
    return featureAdapter.updateOne(
      action.postUpdates, {
        ...state,
        updatePostProcessing: false,
      }
    )
  }),
  on(PostStoreActions.updatePostFailed, (state, action) => {
    return {
      ...state,
      updatePostProcessing: false,
      updatePostError: action.error
    }
  }),

  // Update Post Boilerplate

  on(PostStoreActions.updatePostBoilerplateRequested, (state, action) => {
    return {
      ...state,
      updatePostBoilerplateProcessing: true,
      updatePostBoilerplateError: null,
      postBoilerplateData: null,
    }
  }),
  on(PostStoreActions.updatePostBoilerplateCompleted, (state, action) => {
    return {
      ...state,
      updatePostBoilerplateProcessing: false,
      updatePostBoilerplateError: null,
      postBoilerplateData: action.postBoilerplateUpdates
    }
  }),
  on(PostStoreActions.updatePostBoilerplateFailed, (state, action) => {
    return {
      ...state,
      updatePostBoilerplateProcessing: false,
      updatePostBoilerplateError: action.error,
      postBoilerplateData: null,
    }
  }),

  // Upload Post Image

  on(PostStoreActions.uploadPostImageRequested, (state, action) => {
    return {
      ...state,
      uploadPostImageProcessing: true,
      uploadPostImageError: null,
      postImageDownloadUrl: null
    }
  }),

  on(PostStoreActions.uploadPostImageCompleted, (state, action) => {
    return {
      ...state,
      uploadPostImageProcessing: false,
      uploadPostImageError: null,
      postImageDownloadUrl: action.postImageDownloadUrl
    }
  }),

  on(PostStoreActions.uploadPostImageFailed, (state, action) => {
    return {
      ...state,
      uploadPostImageProcessing: false,
      uploadPostImageError: action.error,
      postImageDownloadUrl: null
    }
  }),  

);

// Exporting a variety of selectors in the form of a object from the entity adapter
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = featureAdapter.getSelectors();