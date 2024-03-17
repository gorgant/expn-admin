import { FirebaseError } from "firebase/app";
import { AdminUser } from "../../../../shared-models/user/admin-user.model";

export interface UserState {
  exportSubscribersError: FirebaseError | Error | null,
  exportSubscribersProcessing: boolean,
  fetchAdminUserError: FirebaseError | Error | null,
  fetchAdminUserProcessing: boolean,
  updateAdminUserError: FirebaseError | Error | null,
  updateAdminUserProcessing: boolean,
  adminUserData: AdminUser | null,
  exportDownloadUrl: string | null,
}

export const initialUserState: UserState = {
  exportSubscribersError: null,
  exportSubscribersProcessing: false,
  fetchAdminUserError: null,
  fetchAdminUserProcessing: false,
  updateAdminUserError: null,
  updateAdminUserProcessing: false,
  adminUserData: null,
  exportDownloadUrl: null,
}