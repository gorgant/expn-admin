import { Action } from '@ngrx/store';
import { AdminUser } from 'src/app/core/models/user/admin-user.model';
import { StoreUserDataType } from 'src/app/core/models/user/store-user-data-type.model';

export enum ActionTypes {
  USER_DATA_REQUESTED = '[User] User Data Requested',
  USER_DATA_LOADED = '[User] User Data Loaded',
  STORE_USER_DATA_REQUESTED = '[User] Store User Data Requested',
  STORE_USER_DATA_COMPLETE = '[User] User Data Stored',
  UPDATE_PASSWORD_REQUESTED = '[User] Update Password Requested',
  UPDATE_PASSWORD_COMPLETE = '[User] Password Updated',
  USER_DATA_LOAD_ERROR = '[User] Load Failure',
}

export class UserDataRequested implements Action {
  readonly type = ActionTypes.USER_DATA_REQUESTED;

  constructor(public payload: { userId: string }) {}
}

export class UserDataLoaded implements Action {
  readonly type = ActionTypes.USER_DATA_LOADED;

  constructor(public payload: { userData: AdminUser }) {}
}

export class StoreUserDataRequested implements Action {
  readonly type = ActionTypes.STORE_USER_DATA_REQUESTED;

  constructor(public payload: { userData: AdminUser | Partial<AdminUser>}) {}
}

export class StoreUserDataComplete implements Action {
  readonly type = ActionTypes.STORE_USER_DATA_COMPLETE;
}

export class UpdatePasswordRequested implements Action {
  readonly type = ActionTypes.UPDATE_PASSWORD_REQUESTED;

  constructor(public payload: { currentPw: string, newPw: string }) {}
}

export class UpdatePasswordComplete implements Action {
  readonly type = ActionTypes.UPDATE_PASSWORD_COMPLETE;
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.USER_DATA_LOAD_ERROR;
  constructor(public payload: { error: string }) {}
}

export type Actions =
UserDataRequested |
UserDataLoaded |
StoreUserDataRequested |
StoreUserDataComplete |
UpdatePasswordRequested |
UpdatePasswordComplete |
LoadErrorDetected
;
