import { AdminUser } from "./admin-user.model";
import { PublicUser } from "./public-user.model";

export interface PublicUserUpdateData {
  userData: PublicUser | Partial<PublicUser>,
  updateType: UserUpdateType
}

export interface AdminUserUpdateData {
  userData: AdminUser | Partial<AdminUser>,
  updateType: UserUpdateType
}

export enum UserUpdateType {
  AUTHENTICATION = 'authentication',
  EMAIL_UPDATE = 'email-update',
  PASSWORD_UPDATE = 'password-update',
  BIO_UPDATE = 'bio-update'
}