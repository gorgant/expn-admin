import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.SINGLE_COUPON_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        loadError: null
      };
    }

    case ActionTypes.SINGLE_COUPON_LOADED: {
      return featureAdapter.addOne(
        action.payload.coupon, {
          ...state,
          isLoading: false,
          loadError: null
        }
      );
    }

    case ActionTypes.ALL_COUPONS_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        loadError: null,
      };
    }

    case ActionTypes.ALL_COUPONS_LOADED: {
      return featureAdapter.setAll(
        action.payload.coupons, {
          ...state,
          isLoading: false,
          loadError: null,
          couponsLoaded: true,
        }
      );
    }

    case ActionTypes.UPDATE_COUPON_REQUESTED: {
      return {
        ...state,
        isSaving: true,
        saveError: null
      };
    }

    case ActionTypes.UPDATE_COUPON_COMPLETE:
      return featureAdapter.updateOne(
        action.payload.coupon,
        {
          ...state,
          isSaving: false,
          saveError: null
        }
      );

    case ActionTypes.DELETE_COUPON_REQUESTED:
      return {
        ...state,
        isDeleting: true,
        deleteError: null,
      };

    case ActionTypes.DELETE_COUPON_COMPLETE:
      return featureAdapter.removeOne(
        action.payload.couponId,
        {
          ...state,
          isDeleting: false,
          deleteError: null
        }
      );

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
