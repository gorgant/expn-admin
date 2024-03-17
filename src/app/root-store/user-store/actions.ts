import { FirebaseError } from "@angular/fire/app";
import { createAction, props } from "@ngrx/store";
import { AdminUser } from "../../../../shared-models/user/admin-user.model";
import { AdminUserUpdateData } from "../../../../shared-models/user/user-update.model";
import { PublicUserExportRequestParams } from "../../../../shared-models/user/public-user-exports.model";

// Export Subscribers

export const exportSubscribersRequested = createAction(
  '[Subscribers Dashboard] Export Subscribers Requested',
  props<{exportParams: PublicUserExportRequestParams}>()
);

export const exportSubscribersCompleted = createAction(
  '[User Service] Export Subscribers Completed',
  props<{downloadUrl: string}>()
);

export const exportSubscribersFailed = createAction(
  '[User Service] Export Subscribers Failed',
  props<{error: FirebaseError}>()
);

// Fetch Admin User

export const fetchAdminUserRequested = createAction(
  '[AppWide] Fetch Admin User Requested',
  props<{adminUserId: string}>()
);

export const fetchAdminUserCompleted = createAction(
  '[User Service] Fetch Admin User Completed',
  props<{userData: AdminUser}>()
);

export const fetchAdminUserFailed = createAction(
  '[User Service] Fetch Admin User Failed',
  props<{error: FirebaseError}>()
);

// Purge User State

export const purgeUserState = createAction(
  '[AppWide] Purge User State'
);

// Purge User State Errors

export const purgeUserStateErrors = createAction(
  '[AppWide] Purge User State Errors'
);


// Update Admin User

export const updateAdminUserRequested = createAction(
  '[AppWide] Update Admin User Requested',
  props<{userUpdateData: AdminUserUpdateData}>()
);

export const updateAdminUserCompleted = createAction(
  '[User Service] Update Admin User Completed',
  props<{updatedUserData: AdminUser}>()
);

export const updateAdminUserFailed = createAction(
  '[User Service] Update Admin User Failed',
  props<{error: FirebaseError}>()
);