import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./state";
import { AdminStoreFeatureKeys } from "../../../../shared-models/store/feature-keys.model";

const selectAuthState = createFeatureSelector<AuthState>(AdminStoreFeatureKeys.AUTH);

const getAuthResultsData = (state: AuthState) => state.authResultsData;
const getConfirmPasswordError = (state: AuthState) => state.confirmPasswordError;
const getConfirmPasswordProcessing = (state: AuthState) => state.confirmPasswordProcessing;
const getEmailAuthError = (state: AuthState) => state.emailAuthError;
const getEmailAuthProcessing = (state: AuthState) => state.emailAuthProcessing;
const getReloadAuthDataError = (state: AuthState) => state.reloadAuthDataError;
const getReloadAuthDataProcessing = (state: AuthState) => state.reloadAuthDataProcessing;
const getResetPasswordError = (state: AuthState) => state.resetPasswordError;
const getResetPasswordProcessing = (state: AuthState) => state.resetPasswordProcessing;

export const selectAuthResultsData = createSelector(
  selectAuthState,
  getAuthResultsData
);

export const selectConfirmPasswordError = createSelector(
  selectAuthState,
  getConfirmPasswordError
);

export const selectConfirmPasswordProcessing = createSelector(
  selectAuthState,
  getConfirmPasswordProcessing
);

export const selectEmailAuthError = createSelector(
  selectAuthState,
  getEmailAuthError
);

export const selectEmailAuthProcessing = createSelector(
  selectAuthState,
  getEmailAuthProcessing
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  auth => !!auth.authResultsData
);

export const selectReloadAuthDataError = createSelector(
  selectAuthState,
  getReloadAuthDataError
);

export const selectReloadAuthDataProcessing = createSelector(
  selectAuthState,
  getReloadAuthDataProcessing
);

export const selectResetPasswordError = createSelector(
  selectAuthState,
  getResetPasswordError
);

export const selectResetPasswordProcessing = createSelector(
  selectAuthState,
  getResetPasswordProcessing
);
