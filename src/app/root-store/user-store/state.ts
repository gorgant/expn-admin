import { FirebaseError } from "firebase/app";
import { AdminUser } from "../../../../shared-models/user/admin-user.model";

export interface UserState {
  exportSubscribersError: FirebaseError | Error | null,
  exportSubscribersProcessing: boolean,
  fetchAdminUserError: FirebaseError | Error | null,
  fetchAdminUserProcessing: boolean,
  processPublicUserImportDataError: FirebaseError | Error | null,
  processPublicUserImportDataProcessing: boolean,
  updateAdminUserError: FirebaseError | Error | null,
  updateAdminUserProcessing: boolean,
  uploadPublicUserImportDataError: FirebaseError | Error | null,
  uploadPublicUserImportDataProcessing: boolean,
  adminUserData: AdminUser | null,
  exportDownloadUrl: string | null,
  publicUserImportDataDownloadUrl: string | null,
}

export const initialUserState: UserState = {
  exportSubscribersError: null,
  exportSubscribersProcessing: false,
  fetchAdminUserError: null,
  fetchAdminUserProcessing: false,
  processPublicUserImportDataError: null,
  processPublicUserImportDataProcessing: false,
  updateAdminUserError: null,
  updateAdminUserProcessing: false,
  uploadPublicUserImportDataError: null,
  uploadPublicUserImportDataProcessing: false,
  adminUserData: null,
  exportDownloadUrl: null,
  publicUserImportDataDownloadUrl: null,
}