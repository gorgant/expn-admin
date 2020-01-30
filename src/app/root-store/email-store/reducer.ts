import { initialState, State } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.SEND_TEST_EMAIL_REQUESTED:
      return {
        ...state,
        emailSendProcessing: true
      };
    case ActionTypes.SEND_TEST_EMAIL_COMPLETE:
      return {
        ...state,
        emailSendProcessing: false
      };
    case ActionTypes.LOAD_FAILURE:
      return {
        ...state,
        emailSendProcessing: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}
