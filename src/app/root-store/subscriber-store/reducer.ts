import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.SINGLE_SUBSCRIBER_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        loadError: null
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
        loadError: null
      };
    }

    case ActionTypes.ALL_SUBSCRIBERS_LOADED: {
      return featureAdapter.setAll(
        action.payload.subscribers, {
          ...state,
          isLoading: false,
          subscribersLoaded: true,
          error: null,
        }
      );
    }

    case ActionTypes.EXPORT_SUBSCRIBERS_REQUESTED: {
      return {
        ...state,
        isExportingSubscribers: true,
        exportSubscribersError: null
      };
    }

    case ActionTypes.EXPORT_SUBSCRIBERS_COMPLETE: {
      return {
        ...state,
        isExportingSubscribers: false,
        exportSubscribersError: null,
        downloadUrl: action.payload.downloadUrl
      };
    }

    case ActionTypes.SUBSCRIBER_COUNT_REQUESTED: {
      return {
        ...state,
        isProcessingSubscriberCount: true,
        subscriberCountError: null
      };
    }

    case ActionTypes.SUBSCRIBER_COUNT_LOADED: {
      return {
        ...state,
        isProcessingSubscriberCount: false,
        subscriberCountError: null,
        subCountData: action.payload.subCountData
      };
    }

    case ActionTypes.LOAD_FAILED: {
      return {
        ...state,
        isLoading: false,
        loadError: action.payload.error
      };
    }

    case ActionTypes.EXPORT_SUBSCRIBERS_FAILED: {
      return {
        ...state,
        isExportingSubscribers: false,
        exportSubscribersError: action.payload.error
      };
    }

    case ActionTypes.SUBSCRIBER_COUNT_FAILED: {
      return {
        ...state,
        isProcessingSubscriberCount: false,
        subscriberCountError: action.payload.error
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
