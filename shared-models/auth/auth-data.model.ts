import { AdminUserKeys } from "../user/admin-user.model";
import { PublicUserKeys } from "../user/public-user.model";

export enum AuthFormKeys {
  EMAIL = 'email',
  FIRST_NAME = 'firstName',
  PASSWORD = 'password',
}

export interface AuthFormData {
  [AuthFormKeys.EMAIL]: string;
  [AuthFormKeys.PASSWORD]: string;
  [AuthFormKeys.FIRST_NAME]?: string;
}

export interface AuthResultsData {
  [AdminUserKeys.ID]: string;
  [AdminUserKeys.EMAIL]: string;
  [AdminUserKeys.DISPLAY_NAME]?: string;
  isNewUser?: boolean;
}