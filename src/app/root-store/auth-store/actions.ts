import { FirebaseError } from "@angular/fire/app";
import { createAction, props } from "@ngrx/store";
import { PasswordConfirmationData } from "../../../../shared-models/auth/password-confirmation-data.model";
import { AuthFormData, AuthResultsData } from "../../../../shared-models/auth/auth-data.model";

// AuthGuard

export const authGuardValidated = createAction(
  '[Auth Guard] AuthGuard Validated'
);

export const authGuardFailed = createAction(
  '[Auth Guard] AuthGuard Failed',
  props<{error: FirebaseError}>()
);

// Confirm Password

export const confirmPasswordRequested = createAction(
  '[Edit Email Component] Confirm Password Requested',
  props<{confirmPasswordData: PasswordConfirmationData}>()
);

export const confirmPasswordCompleted = createAction(
  '[Auth Service] Confirm Password Complete',
  props<{passwordConfirmed: boolean}>()
);

export const confirmPasswordFailed = createAction(
  '[Auth Service] Confirm Password Failed',
  props<{error: FirebaseError}>()
);

// Detect Cached User

export const detectCachedUserRequested = createAction(
  '[App Component] Detected Cached User Requested'
);

export const detectCachedUserCompleted = createAction(
  '[App Component] Detected Cached User Completed',
  props<{authResultsData: AuthResultsData | null}>()
);

export const detectCachedUserFailed = createAction(
  '[App Component] Detected Cached User Failed',
  props<{error: FirebaseError}>()
);

// Email Auth

export const emailAuthRequested = createAction(
  '[Login Form] Email Auth Requested',
  props<{authData: AuthFormData}>()
);

export const emailAuthCompleted = createAction(
  '[Auth Service] Email Auth Completed',
  props<{authResultsData: AuthResultsData}>()
);

export const emailAuthFailed = createAction(
  '[Auth Service] Email Auth Failed',
  props<{error: FirebaseError}>()
);

// Logout

export const logout = createAction(
  '[Top Nav] Logout'
);

// Purge Auth State

export const purgeAuthState = createAction(
  '[AppWide] Purge Auth State'
); 

// Purge Auth State Errors

export const purgeAuthStateErrors = createAction(
  '[AppWide] Purge Auth State Errors'
); 

// Reload Auth Data
export const reloadAuthDataRequested = createAction(
  '[Login Form | Signup Form | Login With Third Party] Reload AuthData Requested'
);

export const reloadAuthDataCompleted = createAction(
  '[Auth Service] Reload AuthData Completed',
  props<{authResultsData: AuthResultsData}>()
);

export const reloadAuthDataFailed = createAction(
  '[Auth Service] Reload AuthData Failed',
  props<{error: FirebaseError}>()
);

// Reset Password
export const resetPasswordRequested = createAction(
  '[Login Form | Profile Component] Reset Password Requested',
  props<{email: string}>()
);

export const resetPasswordCompleted = createAction(
  '[Auth Service] Reset Password Completed',
  props<{resetSubmitted: boolean}>()
);

export const resetPasswordFailed = createAction(
  '[Auth Service] Reset Password Failed',
  props<{error: FirebaseError}>()
);