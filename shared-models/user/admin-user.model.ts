import { Timestamp } from '@angular/fire/firestore';
import { GoogleCloudFunctionsTimestamp } from "../firestore/google-cloud-functions-timestamp.model";

export enum AdminUserKeys {
  CREATED_TIMESTAMP = 'createdTimestamp',
  DISPLAY_NAME = 'displayName',
  EMAIL = 'email',
  ID = 'id',
  IS_SUPER_ADMIN = 'isSuperAdmin',
  LAST_AUTHENTICATED_TIMESTAMP = 'lastAuthenticatedTimestamp',
  LAST_MODIFIED_TIMESTAMP = 'lastModifiedTimestamp'
}

export interface AdminUser {
  [AdminUserKeys.CREATED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
  [AdminUserKeys.DISPLAY_NAME]: string;
  [AdminUserKeys.EMAIL]: string;
  [AdminUserKeys.ID]: string;
  [AdminUserKeys.IS_SUPER_ADMIN]: boolean;
  [AdminUserKeys.LAST_AUTHENTICATED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
  [AdminUserKeys.LAST_MODIFIED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
}

export interface GoogleCloudFunctionsAdminUser extends AdminUser {
  [AdminUserKeys.CREATED_TIMESTAMP]: GoogleCloudFunctionsTimestamp;
  [AdminUserKeys.LAST_AUTHENTICATED_TIMESTAMP]: GoogleCloudFunctionsTimestamp;
  [AdminUserKeys.LAST_MODIFIED_TIMESTAMP]: GoogleCloudFunctionsTimestamp;
}

