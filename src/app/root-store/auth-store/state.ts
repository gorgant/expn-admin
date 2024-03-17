import { FirebaseError } from "firebase/app";
import { AuthResultsData } from "../../../../shared-models/auth/auth-data.model";
import { AdminStoreFeatureKeys } from "../../../../shared-models/store/feature-keys.model";

export interface AuthState {
  authGuardError: FirebaseError | Error | null,
  emailAuthError: FirebaseError | Error | null;
  emailAuthProcessing: boolean;
  confirmPasswordError: FirebaseError | Error | null;
  confirmPasswordProcessing: boolean;
  reloadAuthDataError: FirebaseError | Error | null, 
  reloadAuthDataProcessing: boolean,
  resetPasswordError: FirebaseError | Error | null,
  resetPasswordProcessing: boolean,
  authResultsData: AuthResultsData | null,
}

export const initialAuthState: AuthState = {
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