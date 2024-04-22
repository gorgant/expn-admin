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
      exportDownloadUrl: action.exportDownloadUrl
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

  // Process Public User Import Data

  on(UserStoreActions.processPublicUserImportDataRequested, (state, action) => {
    return {
      ...state,
      processPublicUserImportDataProcessing: true,
      processPublicUserImportDataError: null
    }
  }),
  on(UserStoreActions.processPublicUserImportDataCompleted, (state, action) => {
    return {
      ...state,
      processPublicUserImportDataProcessing: false,
    }
  }),
  on(UserStoreActions.processPublicUserImportDataFailed, (state, action) => {
    return {
      ...state,
      processPublicUserImportDataProcessing: false,
      processPublicUserImportDataError: action.error
    }
  }),

  // Purge Export Download Url

  on(UserStoreActions.purgeExportDownloadUrl, (state, action) => {
    return {
      ...state,
      exportDownloadUrl: null,
    }
  }),

  // Purge Import Download Url

  on(UserStoreActions.purgeImportDownloadUrl, (state, action) => {
    return {
      ...state,
      publicUserImportDataDownloadUrl: null,
    }
  }),

  // Purge User State Data
  
  on(UserStoreActions.purgeUserState, (state, action) => {
    return {
      ...state,
      exportSubscribersError: null,
      exportSubscribersProcessing: false,
      fetchAdminUserError: null,
      fetchAdminUserProcessing: false,
      updateAdminUserError: null,
      updateAdminUserProcessing: false,
      adminUserData: null,
      exportDownloadUrl: null,
    }
  }),

  // Purge User State Errors

  on(UserStoreActions.purgeUserStateErrors, (state, action) => {
    return {
      ...state,
      exportSubscribersError: null,
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

  // Upload Public User Import Data

  on(UserStoreActions.uploadPublicUserImportDataRequested, (state, action) => {
    return {
      ...state,
      uploadPublicUserImportDataProcessing: true,
      uploadPublicUserImportDataError: null
    }
  }),
  on(UserStoreActions.uploadPublicUserImportDataCompleted, (state, action) => {
    return {
      ...state,
      uploadPublicUserImportDataProcessing: false,
      publicUserImportDataDownloadUrl: action.publicUserImportDataDownloadUrl
    }
  }),
  on(UserStoreActions.uploadPublicUserImportDataFailed, (state, action) => {
    return {
      ...state,
      uploadPublicUserImportDataProcessing: false,
      uploadPublicUserImportDataError: action.error
    }
  }),

);

export const userMetaReducers: MetaReducer<UserState>[] = !environment.production ? [] : [];
