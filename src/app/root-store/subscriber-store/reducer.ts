import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.SINGLE_SUBSCRIBER_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }

    case ActionTypes.SINGLE_SUBSCRIBER_LOADED: {
      return featureAdapter.addOne(
        action.payload.subscriber, {
          ...state,
          isLoading: false,
          error: null
        }
      );
    }

    case ActionTypes.ALL_SUBSCRIBERS_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }

    case ActionTypes.ALL_SUBSCRIBERS_LOADED: {
      return featureAdapter.addAll(
        action.payload.subscribers, {
          ...state,
          isLoading: false,
          subscribersLoaded: true,
          error: null,
        }
      );
    }

    case ActionTypes.LOAD_FAILURE: {
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
