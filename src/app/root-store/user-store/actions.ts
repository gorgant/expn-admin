import { FirebaseError } from "@angular/fire/app";
import { createAction, props } from "@ngrx/store";
import { AdminUser } from "../../../../shared-models/user/admin-user.model";
import { AdminUserUpdateData } from "../../../../shared-models/user/user-update.model";
import { PublicUserExportRequestParams } from "../../../../shared-models/user/public-user-exports.model";
import { PublicUserImportData, PublicUserImportMetadata } from "../../../../shared-models/user/public-user-import-data.model";

// Export Subscribers

export const exportSubscribersRequested = createAction(
  '[Subscribers Dashboard] Export Subscribers Requested',
  props<{exportParams: PublicUserExportRequestParams}>()
);

export const exportSubscribersCompleted = createAction(
  '[User Service] Export Subscribers Completed',
  props<{exportDownloadUrl: string}>()
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

// Process Public User Import Data

export const processPublicUserImportDataRequested = createAction(
  '[Data Uploader] Process Public User Import Data Requested',
  props<{publicUserImportMetadata: PublicUserImportMetadata}>()
);

export const processPublicUserImportDataCompleted = createAction(
  '[User Service] Process Public User Import Data Completed',
  props<{pubSubResponse: string}>()
);

export const processPublicUserImportDataFailed = createAction(
  '[User Service] Process Public User Import Data Failed',
  props<{error: FirebaseError}>()
);

// Purge User State

export const purgeUserState = createAction(
  '[AppWide] Purge User State'
);

// Purge Export Download Url

export const purgeExportDownloadUrl = createAction(
  '[AppWide] Purge Export Download Url'
);

// Purge Import Download Url

export const purgeImportDownloadUrl = createAction(
  '[AppWide] Purge Import Download Url'
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

// Upload Public User Import Data

export const uploadPublicUserImportDataRequested = createAction(
  '[Data Uploader] Upload Public User Import Data Requested',
  props<{publicUserImportData: PublicUserImportData}>()
);

export const uploadPublicUserImportDataCompleted = createAction(
  '[User Service] Upload Public User Import Data Completed',
  props<{publicUserImportDataDownloadUrl: string}>()
);

export const uploadPublicUserImportDataFailed = createAction(
  '[User Service] Upload Public User Import Data Failed',
  props<{error: FirebaseError}>()
);