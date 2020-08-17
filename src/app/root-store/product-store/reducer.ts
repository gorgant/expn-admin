import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.SINGLE_PRODUCT_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        loadError: null
      };
    }

    case ActionTypes.SINGLE_PRODUCT_LOADED: {
      return featureAdapter.addOne(
        action.payload.product, {
          ...state,
          isLoading: false,
          loadError: null
        }
      );
    }

    case ActionTypes.ALL_PRODUCTS_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        loadError: null
      };
    }

    case ActionTypes.ALL_PRODUCTS_LOADED: {
      return featureAdapter.addAll(
        action.payload.products, {
          ...state,
          isLoading: false,
          loadError: null,
          productsLoaded: true
        }
      );
    }

    case ActionTypes.UPDATE_PRODUCT_REQUESTED:
      return {
        ...state,
        isSaving: true,
        saveError: null
      };

    case ActionTypes.UPDATE_PRODUCT_COMPLETE:
      return featureAdapter.upsertOne(
        action.payload.product,
        {
          ...state,
          isSaving: false,
          saveError: null
        }
      );

    case ActionTypes.ROLLBACK_PRODUCT_REQUESTED:
      return {
        ...state,
        isSaving: true,
        saveError: null
      };

    case ActionTypes.ROLLBACK_PRODUCT_COMPLETE:
      return featureAdapter.addOne(
        action.payload.product,
        {
          ...state,
          isSaving: false,
          saveError: null
        }
      );

    case ActionTypes.DELETE_PRODUCT_REQUESTED:
      return {
        ...state,
        isDeleting: true,
        deleteError: null
      };

    case ActionTypes.DELETE_PRODUCT_COMPLETE:
      return featureAdapter.removeOne(
        action.payload.productId,
        {
          ...state,
          isDeleting: false,
          deleteError: null
        }
      );

    case ActionTypes.TOGGLE_ACTIVE_REQUESTED:
      return {
        ...state,
        isTogglingActive: true,
      };

    case ActionTypes.TOGGLE_ACTIVE_COMPLETE:
      return {
        ...state,
        isTogglingActive: false
      };

    case ActionTypes.CLONE_PRODUCT_REQUESTED:
      return {
        ...state,
        isCloningProduct: true,
      };

    case ActionTypes.CLONE_PRODUCT_COMPLETE:
      return {
        ...state,
        isCloningProduct: false,
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
        isTogglingActive: false,
        publicUpdateError: action.payload.error
      };
    }

    case ActionTypes.ALT_ENV_OP_FAILED: {
      return {
        ...state,
        isCloningProduct: false,
        altEnvOpError: action.payload.error
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
