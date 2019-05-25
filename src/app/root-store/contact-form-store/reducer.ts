import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.SINGLE_CONTACT_FORM_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }

    case ActionTypes.SINGLE_CONTACT_FORM_LOADED: {
      return featureAdapter.addOne(
        action.payload.contactForm, {
          ...state,
          isLoading: false,
          error: null
        }
      );
    }

    case ActionTypes.ALL_CONTACT_FORMS_REQUESTED: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }

    case ActionTypes.ALL_CONTACT_FORMS_LOADED: {
      return featureAdapter.addAll(
        action.payload.contactForms, {
          ...state,
          isLoading: false,
          contactFormsLoaded: true,
          error: null,
        }
      );
    }

    case ActionTypes.SUBSCRIBER_CONTACT_FORMS_REQUESTED: {
      return {
        ...state,
        subscriberContactFormsLoading: true
      };
    }

    case ActionTypes.SUBSCRIBER_CONTACT_FORMS_LOADED: {
      return featureAdapter.addMany(
        action.payload.contactForms, {
          ...state,
          subscriberContactFormsLoading: false,
          error: null,
        }
      );
    }

    case ActionTypes.LOAD_FAILURE: {
      return {
        ...state,
        isLoading: false,
        subscriberContactFormsLoading: false,
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
