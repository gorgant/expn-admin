import {
  createReducer,
  MetaReducer,
  on
} from '@ngrx/store';
import * as  UserStoreActions from './actions';
import { initialUserState, UserState } from './state';
import { environment } from '../../../environments/environment';



export const userStoreReducer = createReducer(
  initialUserState,

  // Export Subscribers

  on(UserStoreActions.exportSubscribersRequested, (state, action) => {
    return {
      ...state,
      exportSubscribersProcessing: true,
      exportSubscribersError: null
    }
  }),
  on(UserStoreActions.exportSubscribersCompleted, (state, action) => {
    return {
      ...state,
      exportSubscribersProcessing: false,
      exportDownloadUrl: action.downloadUrl
    }
  }),
  on(UserStoreActions.exportSubscribersFailed, (state, action) => {
    return {
      ...state,
      exportSubscribersProcessing: false,
      exportSubscribersError: action.error
    }
  }),

  // Fetch Admin User

  on(UserStoreActions.fetchAdminUserRequested, (state, action) => {
    return {
      ...state,
      fetchAdminUserProcessing: true,
      fetchAdminUserError: null
    }
  }),
  on(UserStoreActions.fetchAdminUserCompleted, (state, action) => {
    return {
      ...state,
      fetchAdminUserProcessing: false,
      adminUserData: action.userData
    }
  }),
  on(UserStoreActions.fetchAdminUserFailed, (state, action) => {
    return {
      ...state,
      fetchAdminUserProcessing: false,
      fetchAdminUserError: action.error
    }
  }),

  // Purge Auth State Data
  
  on(UserStoreActions.purgeUserState, (state, action) => {
    return {
      ...state,
      fetchAdminUserError: null,
      fetchAdminUserProcessing: false,
      updateAdminUserError: null,
      updateAdminUserProcessing: false,
      adminUserData: null,
    }
  }),

  // Purge Auth State Errors

  on(UserStoreActions.purgeUserStateErrors, (state, action) => {
    return {
      ...state,
      fetchAdminUserError: null,
      updateAdminUserError: null,
    }
  }),

  // Update Admin User
  
  on(UserStoreActions.updateAdminUserRequested, (state, action) => {
    return {
      ...state,
      updateAdminUserProcessing: true,
      updateAdminUserError: null
    }
  }),
  on(UserStoreActions.updateAdminUserCompleted, (state, action) => {
    return {
      ...state,
      updateAdminUserProcessing: false,
      adminUserData: action.updatedUserData
    }
  }),
  on(UserStoreActions.updateAdminUserFailed, (state, action) => {
    return {
      ...state,
      updateAdminUserProcessing: false,
      updateAdminUserError: action.error
    }
  }),

);

export const userMetaReducers: MetaReducer<UserState>[] = !environment.production ? [] : [];
