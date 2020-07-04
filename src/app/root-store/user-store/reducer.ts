import { initialState, State } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.USER_DATA_REQUESTED:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ActionTypes.USER_DATA_LOADED:
      return {
        ...state,
        user: action.payload.userData,
        isLoading: false,
        error: null,
        userLoaded: true,
      };
    case ActionTypes.STORE_USER_DATA_REQUESTED:
      return {
        ...state,
        isLoading: true,
      };
    case ActionTypes.UPDATE_PASSWORD_COMPLETE:
      return {
        ...state,
        error: null,
      };
    case ActionTypes.LOAD_SERVER_EDITOR_SESSION_REQUESTED:
      return {
        ...state,
        isLoadingServerEditorSession: true,
      };
    case ActionTypes.LOAD_SERVER_EDITOR_SESSION_COMPLETE:
      return {
        ...state,
        serverEditorSession: action.payload.currentEditorSession,
        isLoadingServerEditorSession: false,
      };
    case ActionTypes.CREATE_EDITOR_SESSION_REQUESTED:
      return {
        ...state,
        isCreatingEditorSession: true,
      };
    case ActionTypes.CREATE_EDITOR_SESSION_COMPLETE:
      return {
        ...state,
        isCreatingEditorSession: false,
        serverEditorSessionCreated: true
      };
    case ActionTypes.UPDATE_EDITOR_SESSION_REQUESTED:
      return {
        ...state,
        isUpdatingEditorSession: true,
      };
    case ActionTypes.UPDATE_EDITOR_SESSION_COMPLETE:
      return {
        ...state,
        isUpdatingEditorSession: false,
      };
    case ActionTypes.DELETE_EDITOR_SESSION_REQUESTED:
      return {
        ...state,
        isDeletingEditorSession: true,
      };
    case ActionTypes.DELETE_EDITOR_SESSION_COMPLETE:
      return {
        ...state,
        isDeletingEditorSession: false,
      };
    case ActionTypes.LOAD_ACTIVE_EDITOR_SESSIONS_REQUESTED:
      return {
        ...state,
        isLoadingActiveEditorSessions: true,
      };
    case ActionTypes.LOAD_ACTIVE_EDITOR_SESSIONS_COMPLETE:
      return {
        ...state,
        isLoadingActiveEditorSessions: false,
        activeEditorSessions: action.payload.activeEditorSessions,
        activeEditorSessionsLoaded: true
      };
    case ActionTypes.DISCONNECT_ACTIVE_EDITOR_SESSIONS_REQUESTED:
      return {
        ...state,
        isDisconnectingActiveEditorSessions: true,
      };
    case ActionTypes.DISCONNECT_ACTIVE_EDITOR_SESSIONS_COMPLETE:
      return {
        ...state,
        isDisconnectingActiveEditorSessions: false,
      };
    case ActionTypes.PURGE_EDITOR_SESSION_DATA:
      return {
        ...state,
        serverEditorSession: null,
        activeEditorSessions: null,
        isLoadingServerEditorSession: false,
        isCreatingEditorSession: false,
        isUpdatingEditorSession: false,
        isDeletingEditorSession: false,
        isLoadingActiveEditorSessions: false,
        isDisconnectingActiveEditorSessions: false,
        loadServerEditorSessionError: null,
        createEditorSessionError: null,
        updateEditorSessionError: null,
        deleteEditorSessionError: null,
        loadActiveEditorSessionsError: null,
        disconnectActiveEditorSessionsError: null,
        serverEditorSessionCreated: false,
        activeEditorSessionsLoaded: false

      };
    case ActionTypes.USER_DATA_LOAD_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    case ActionTypes.LOAD_SERVER_EDITOR_SESSION_FAILED:
      return {
        ...state,
        isLoadingServerEditorSession: false,
        loadServerEditorSessionError: action.payload.error
      };
    case ActionTypes.CREATE_EDITOR_SESSION_FAILED:
      return {
        ...state,
        isCreatingEditorSession: false,
        createEditorSessionError: action.payload.error
      };
    case ActionTypes.UPDATE_EDITOR_SESSION_FAILED:
      return {
        ...state,
        isUpdatingEditorSession: false,
        updateEditorSessionError: action.payload.error
      };
    case ActionTypes.DELETE_EDITOR_SESSION_FAILED:
      return {
        ...state,
        isDeletingEditorSession: false,
        deleteEditorSessionError: action.payload.error
      };
    case ActionTypes.LOAD_ACTIVE_EDITOR_SESSIONS_FAILED:
      return {
        ...state,
        isLoadingActiveEditorSessions: false,
        loadActiveEditorSessionsError: action.payload.error
      };
    case ActionTypes.DISCONNECT_ACTIVE_EDITOR_SESSIONS_FAILED:
      return {
        ...state,
        isDisconnectingActiveEditorSessions: false,
        disconnectActiveEditorSessionsError: action.payload.error
      };

    default: {
      return state;
    }
  }
}
