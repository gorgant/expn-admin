import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.SINGLE_POST_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        loadError: null
      };
    }

    case ActionTypes.SINGLE_POST_LOADED: {
      return featureAdapter.addOne(
        action.payload.post, {
          ...state,
          isLoading: false,
          loadError: null
        }
      );
    }

    case ActionTypes.ALL_POSTS_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        loadError: null
      };
    }

    case ActionTypes.ALL_POSTS_LOADED: {
      return featureAdapter.addAll(
        action.payload.posts, {
          ...state,
          isLoading: false,
          loadError: null,
          postsLoaded: true
        }
      );
    }

    case ActionTypes.UPDATE_POST_REQUESTED:
      return {
        ...state,
        isSaving: true,
        saveError: null
      };

    case ActionTypes.UPDATE_POST_COMPLETE:
      return featureAdapter.upsertOne(
        action.payload.post,
        {
          ...state,
          isSaving: false,
          saveError: null
        }
      );

    case ActionTypes.ROLLBACK_POST_REQUESTED:
      return {
        ...state,
        isSaving: true,
        saveError: null
      };

    case ActionTypes.ROLLBACK_POST_COMPLETE:
      return featureAdapter.addOne(
        action.payload.post,
        {
          ...state,
          isSaving: false,
          saveError: null
        }
      );

    case ActionTypes.DELETE_POST_REQUESTED:
      return {
        ...state,
        isDeleting: true,
        deleteError: null
      };

    case ActionTypes.DELETE_POST_COMPLETE:
      return featureAdapter.removeOne(
        action.payload.postId,
        {
          ...state,
          isDeleting: false,
          deleteError: null
        }
      );

    case ActionTypes.TOGGLE_PUBLISHED_REQUESTED:
      return {
        ...state,
        isTogglingPublished: true,
      };

    case ActionTypes.TOGGLE_PUBLISHED_COMPLETE:
      return {
        ...state,
        isTogglingPublished: false,
      };

    case ActionTypes.TOGGLE_FEATURED_REQUESTED:
      return {
        ...state,
        isTogglingFeatured: true,
      };

    case ActionTypes.TOGGLE_FEATURED_COMPLETE:
      return {
        ...state,
        isTogglingFeatured: false,
      };

    case ActionTypes.REFRESH_PUBLIC_BLOG_INDEX_COMPLETE:
      return {
        ...state
      };

    case ActionTypes.REFRESH_PUBLIC_BLOG_CACHE_COMPLETE:
      return {
        ...state
      };

    case ActionTypes.REFRESH_PUBLIC_FEATURED_POSTS_CACHE_COMPLETE:
      return {
        ...state
      };

    case ActionTypes.LOAD_FAILED: {
      return {
        ...state,
        isLoading: false,
        loadError: action.payload.error
      };
    }

    case ActionTypes.SAVE_FAILED: {
      return {
        ...state,
        isSaving: false,
        saveError: action.payload.error
      };
    }

    case ActionTypes.DELETE_FAILED: {
      return {
        ...state,
        isDeleting: false,
        deleteError: action.payload.error
      };
    }

    case ActionTypes.PUBLIC_UPDATE_FAILED: {
      return {
        ...state,
        isTogglingPublished: false,
        isTogglingFeatured: false,
        publicUpdateError: action.payload.error
      };
    }

    default: {
      return state;
    }
  }
}

// Exporting a variety of selectors in the form of a object from the entity adapter
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = featureAdapter.getSelectors();
