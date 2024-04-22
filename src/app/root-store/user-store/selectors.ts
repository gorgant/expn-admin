import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./state";
import { AdminStoreFeatureKeys } from "../../../../shared-models/store/feature-keys.model";

const selectUserState = createFeatureSelector<UserState>(AdminStoreFeatureKeys.USER);

const getAdminUserData = (state: UserState) => state.adminUserData;
const getPublicUserImportDataDownloadUrl = (state: UserState) => state.publicUserImportDataDownloadUrl;
const getExportDownloadUrl = (state: UserState) => state.exportDownloadUrl;
const getExportSubscribersError = (state: UserState) => state.exportSubscribersError;
const getExportSubscribersProcessing = (state: UserState) => state.exportSubscribersProcessing;
const getFetchAdminUserError = (state: UserState) => state.fetchAdminUserError;
const getFetchAdminUserProcessing = (state: UserState) => state.fetchAdminUserProcessing;
const getProcessPublicUserImportDataError = (state: UserState) => state.processPublicUserImportDataError;
const getProcessPublicUserImportDataProcessing = (state: UserState) => state.processPublicUserImportDataProcessing;
const getUpdateAdminUserError = (state: UserState) => state.updateAdminUserError;
const getUpdateAdminUserProcessing = (state: UserState) => state.updateAdminUserProcessing;
const getUploadPublicUserImportDataError = (state: UserState) => state.uploadPublicUserImportDataError;
const getUploadPublicUserImportDataProcessing = (state: UserState) => state.uploadPublicUserImportDataProcessing;


export const selectExportDownloadUrl = createSelector(
  selectUserState,
  getExportDownloadUrl
);

export const selectExportSubscribersError = createSelector(
  selectUserState,
  getExportSubscribersError
);

export const selectExportSubscribersProcessing = createSelector(
  selectUserState,
  getExportSubscribersProcessing
);

export const selectFetchAdminUserError = createSelector(
  selectUserState,
  getFetchAdminUserError
);

export const selectFetchAdminUserProcessing = createSelector(
  selectUserState,
  getFetchAdminUserProcessing
);

export const selectProcessPublicUserImportDataError = createSelector(
  selectUserState,
  getProcessPublicUserImportDataError
);

export const selectProcessPublicUserImportDataProcessing = createSelector(
  selectUserState,
  getProcessPublicUserImportDataProcessing
);

export const selectPublicUserImportDataDownloadUrl = createSelector(
  selectUserState,
  getPublicUserImportDataDownloadUrl
);

export const selectUpdateAdminUserError = createSelector(
  selectUserState,
  getUpdateAdminUserError
);

export const selectUpdateAdminUserProcessing = createSelector(
  selectUserState,
  getUpdateAdminUserProcessing
);

export const selectAdminUserData = createSelector(
  selectUserState,
  getAdminUserData
);

export const selectUploadPublicUserImportDataError = createSelector(
  selectUserState,
  getUploadPublicUserImportDataError
);

export const selectUploadPublicUserImportDataProcessing = createSelector(
  selectUserState,
  getUploadPublicUserImportDataProcessing
);