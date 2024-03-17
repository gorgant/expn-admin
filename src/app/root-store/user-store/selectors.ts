import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./state";
import { AdminStoreFeatureKeys } from "../../../../shared-models/store/feature-keys.model";

const selectUserState = createFeatureSelector<UserState>(AdminStoreFeatureKeys.USER);

const getExportSubscribersError = (state: UserState) => state.exportSubscribersError;
const getExportSubscribersProcessing = (state: UserState) => state.exportSubscribersProcessing;
const getFetchAdminUserError = (state: UserState) => state.fetchAdminUserError;
const getFetchAdminUserProcessing = (state: UserState) => state.fetchAdminUserProcessing;
const getUpdateAdminUserError = (state: UserState) => state.updateAdminUserError;
const getUpdateAdminUserProcessing = (state: UserState) => state.updateAdminUserProcessing;
const getAdminUserData = (state: UserState) => state.adminUserData;

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
