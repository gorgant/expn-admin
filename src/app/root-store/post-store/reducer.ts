import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.SINGLE_POST_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }

    case ActionTypes.SINGLE_POST_LOADED: {
      return featureAdapter.addOne(
        action.payload.post, {
          ...state,
          isLoading: false,
          error: null
        }
      );
    }

    case ActionTypes.ALL_POSTS_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }

    case ActionTypes.ALL_POSTS_LOADED: {
      return featureAdapter.addAll(
        action.payload.posts, {
          ...state,
          isLoading: false,
          postsLoaded: true,
          error: null,
        }
      );
    }

    case ActionTypes.ADD_POST_COMPLETE:
      return featureAdapter.addOne(
        action.payload.post,
        {
          ...state,
        }
      );

    case ActionTypes.UPDATE_POST_COMPLETE:
      return featureAdapter.updateOne(
        action.payload.post,
        {
          ...state,
        }
      );

    case ActionTypes.DELETE_POST_REQUESTED:
      return {
        ...state,
        deletionProcessing: true,
      };

    case ActionTypes.DELETE_POST_COMPLETE:
      return featureAdapter.removeOne(
        action.payload.postId,
        {
          ...state,
          deletionProcessing: false,
        }
      );

    case ActionTypes.TOGGLE_PUBLISHED_COMPLETE:
      return {
        ...state
      };

    case ActionTypes.TOGGLE_FEATURED_COMPLETE:
      return {
        ...state
      };

    case ActionTypes.POST_LOAD_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
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
