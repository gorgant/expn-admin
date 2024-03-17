import {
  createReducer,
  MetaReducer,
  on
} from '@ngrx/store';
import * as AuthStoreActions from './actions';
import { AuthState, initialAuthState } from './state';
import { environment } from '../../../environments/environment';



export const authStoreReducer = createReducer(
  initialAuthState,

  // Auth Guard Failure

  on(AuthStoreActions.authGuardValidated, (state, action) => {
    return {
      ...state,
      authGuardError: null
    }
  }),

  on(AuthStoreActions.authGuardFailed, (state, action) => {
    return {
      ...state,
      authGuardError: action.error
    }
  }),

  // Confirm Password

  on(AuthStoreActions.confirmPasswordRequested, (state, action) => {
    return {
      ...state,
      confirmPasswordProcessing: true,
      confirmPasswordError: null
    }
  }),
  on(AuthStoreActions.confirmPasswordCompleted, (state, action) => {
    return {
      ...state,
      confirmPasswordProcessing: false,
    }
  }),
  on(AuthStoreActions.confirmPasswordFailed, (state, action) => {
    return {
      ...state,
      confirmPasswordProcessing: false,
      confirmPasswordError: action.error
    }
  }),

  // Detect Cached User

  on(AuthStoreActions.detectCachedUserRequested, (state, action) => {
    return {
      ...state,
      authProcessing: true,
      authError: null
    }
  }),
  on(AuthStoreActions.detectCachedUserCompleted, (state, action) => {
    return {
      ...state,
      authProcessing: false,
      authResultsData: action.authResultsData
    }
  }),
  on(AuthStoreActions.detectCachedUserFailed, (state, action) => {
    return {
      ...state,
      authProcessing: false,
      authError: action.error
    }
  }),

  // Email Auth

  on(AuthStoreActions.emailAuthRequested, (state, action) => {
    return {
      ...state,
      emailAuthProcessing: true,
      emailAuthError: null
    }
  }),
  on(AuthStoreActions.emailAuthCompleted, (state, action) => {
    return {
      ...state,
      emailAuthProcessing: false,
      authResultsData: action.authResultsData
    }
  }),
  on(AuthStoreActions.emailAuthFailed, (state, action) => {
    return {
      ...state,
      emailAuthProcessing: false,
      emailAuthError: action.error
    }
  }),
  
  // Logout

  on(AuthStoreActions.logout, (state, action) => {
    return {
    ...state,
    authGuardError: null,
    confirmPasswordError: null,
    confirmPasswordProcessing: false,
    emailAuthError: null,
    emailAuthProcessing: false,
    reloadAuthDataError: null, 
    reloadAuthDataProcessing: false,
    resetPasswordError: null,
    resetPasswordProcessing: false,
    authResultsData: null,
    }
  }),

  // Purge Auth State

  on(AuthStoreActions.purgeAuthState, (state, action) => {
    return {
      ...state,
      authGuardError: null,
      confirmPasswordError: null,
      confirmPasswordProcessing: false,
      emailAuthError: null,
      emailAuthProcessing: false,
      reloadAuthDataError: null, 
      reloadAuthDataProcessing: false,
      resetPasswordError: null,
      resetPasswordProcessing: false,
      authResultsData: null,
    }
  }),

  // Purge Auth State Errors

  on(AuthStoreActions.purgeAuthStateErrors, (state, action) => {
    return {
      ...state,
      authGuardError: null,
      confirmPasswordError: null,
      emailAuthError: null,
      reloadAuthDataError: null, 
      resetPasswordError: null,
    }
  }),
  
  // Reload Auth Data

  on(AuthStoreActions.reloadAuthDataRequested, (state, action) => {
    return {
      ...state,
      reloadAuthDataProcessing: true,
      reloadAuthDataError: null,
    }
  }),
  on(AuthStoreActions.reloadAuthDataCompleted, (state, action) => {
    return {
      ...state,
      reloadAuthDataProcessing: false,
      authResultsData: action.authResultsData
    }
  }),
  on(AuthStoreActions.reloadAuthDataFailed, (state, action) => {
    return {
      ...state,
      reloadAuthDataProcessing: false,
      reloadAuthDataError: action.error,
    }
  }),

  // Reset Password

  on(AuthStoreActions.resetPasswordRequested, (state, action) => {
    return {
      ...state,
      resetPasswordProcessing: true,
      resetPasswordError: null,
    }
  }),
  on(AuthStoreActions.resetPasswordCompleted, (state, action) => {
    return {
      ...state,
      resetPasswordProcessing: false,
    }
  }),
  on(AuthStoreActions.resetPasswordFailed, (state, action) => {
    return {
      ...state,
      resetPasswordProcessing: false,
      resetPasswordError: action.error,
    }
  }),

);

export const authMetaReducers: MetaReducer<AuthState>[] = !environment.production ? [] : [];
