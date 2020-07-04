import { Action } from '@ngrx/store';
import { AdminUser } from 'shared-models/user/admin-user.model';
import { EditorSession } from 'shared-models/editor-sessions/editor-session.model';

export enum ActionTypes {
  USER_DATA_REQUESTED = '[User] User Data Requested',
  USER_DATA_LOADED = '[User] User Data Loaded',
  STORE_USER_DATA_REQUESTED = '[User] Store User Data Requested',
  STORE_USER_DATA_COMPLETE = '[User] User Data Stored',
  UPDATE_PASSWORD_REQUESTED = '[User] Update Password Requested',
  UPDATE_PASSWORD_COMPLETE = '[User] Password Updated',
  LOAD_SERVER_EDITOR_SESSION_REQUESTED = '[User] Load Server Editor Session Requested',
  LOAD_SERVER_EDITOR_SESSION_COMPLETE = '[User] Load Server Editor Session Complete',
  CREATE_EDITOR_SESSION_REQUESTED = '[User] Create Editor Session Requested',
  CREATE_EDITOR_SESSION_COMPLETE = '[User] Create Editor Session Complete',
  UPDATE_EDITOR_SESSION_REQUESTED = '[User] Update Editor Session Requested',
  UPDATE_EDITOR_SESSION_COMPLETE = '[User] Update Editor Session Complete',
  DELETE_EDITOR_SESSION_REQUESTED = '[User] Delete Editor Sesssion Requested',
  DELETE_EDITOR_SESSION_COMPLETE = '[User] Delete Editor Sesssion Complete',
  LOAD_ACTIVE_EDITOR_SESSIONS_REQUESTED = '[User] Load Active Editor Sessions Requested',
  LOAD_ACTIVE_EDITOR_SESSIONS_COMPLETE = '[User] Load Active Editor Sessions Loaded',
  DISCONNECT_ACTIVE_EDITOR_SESSIONS_REQUESTED = '[User] Disconnect Active Editor Sessions Requested',
  DISCONNECT_ACTIVE_EDITOR_SESSIONS_COMPLETE = '[User] Disconnect Active Editor Sessions Complete',
  PURGE_EDITOR_SESSION_DATA = '[User] Purge Editor Session Data',
  USER_DATA_LOAD_ERROR = '[User] Load Failure',
  CREATE_EDITOR_SESSION_FAILED = '[User] Create Editor Session Failed',
  LOAD_SERVER_EDITOR_SESSION_FAILED = '[User] Load Server Editor Session Failed',
  UPDATE_EDITOR_SESSION_FAILED = '[User] Save Editor Session Failed',
  DELETE_EDITOR_SESSION_FAILED = '[User] Delete Editor Session Failed',
  LOAD_ACTIVE_EDITOR_SESSIONS_FAILED = '[User] Load Active Editor Sessions Failed',
  DISCONNECT_ACTIVE_EDITOR_SESSIONS_FAILED = '[User] Disconnect Active Editor Sessions Failed'
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

export class LoadServerEditorSessionRequested implements Action {
  readonly type = ActionTypes.LOAD_SERVER_EDITOR_SESSION_REQUESTED;

  constructor(public payload: { sessionId: string }) {}
}

export class LoadCurrentEditorSessionComplete implements Action {
  readonly type = ActionTypes.LOAD_SERVER_EDITOR_SESSION_COMPLETE;

  constructor(public payload: { currentEditorSession: EditorSession }) {}
}

export class CreateEditorSessionRequested implements Action {
  readonly type = ActionTypes.CREATE_EDITOR_SESSION_REQUESTED;

  constructor(public payload: { newEditorSession: EditorSession }) {}
}

export class CreateEditorSessionComplete implements Action {
  readonly type = ActionTypes.CREATE_EDITOR_SESSION_COMPLETE;
}

export class UpdateEditorSessionRequested implements Action {
  readonly type = ActionTypes.UPDATE_EDITOR_SESSION_REQUESTED;

  constructor(public payload: { editorSessionUpdate: EditorSession | Partial<EditorSession> }) {}
}

export class UpdateEditorSessionComplete implements Action {
  readonly type = ActionTypes.UPDATE_EDITOR_SESSION_COMPLETE;
}

export class DeleteEditorSessionRequested implements Action {
  readonly type = ActionTypes.DELETE_EDITOR_SESSION_REQUESTED;

  constructor(public payload: { sessionId: string }) {}
}

export class DeleteEditorSessionComplete implements Action {
  readonly type = ActionTypes.DELETE_EDITOR_SESSION_COMPLETE;

  constructor(public payload: { sessionId: string }) {}
}

export class LoadActiveEditorSessionsRequested implements Action {
  readonly type = ActionTypes.LOAD_ACTIVE_EDITOR_SESSIONS_REQUESTED;

  constructor(public payload: { currentEditorSession: EditorSession }) {}
}

export class LoadActiveEditorSessionsComplete implements Action {
  readonly type = ActionTypes.LOAD_ACTIVE_EDITOR_SESSIONS_COMPLETE;

  constructor(public payload: { activeEditorSessions: EditorSession[] }) {}
}

export class DisconnectActiveEditorSessionsRequested implements Action {
  readonly type = ActionTypes.DISCONNECT_ACTIVE_EDITOR_SESSIONS_REQUESTED;

  constructor(public payload: { currentEditorSession: EditorSession, activeEditorSessions: EditorSession[] }) {}
}

export class DisconnectActiveEditorSessionsComplete implements Action {
  readonly type = ActionTypes.DISCONNECT_ACTIVE_EDITOR_SESSIONS_COMPLETE;

  constructor(public payload: { operationResponse: string }) {}
}

export class PurgeEditorSessionData implements Action {
  readonly type = ActionTypes.PURGE_EDITOR_SESSION_DATA;
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.USER_DATA_LOAD_ERROR;
  constructor(public payload: { error: string }) {}
}

export class CreateEditorSessionFailed implements Action {
  readonly type = ActionTypes.CREATE_EDITOR_SESSION_FAILED;
  constructor(public payload: { error: string }) {}
}

export class LoadCurrentEditorSessionFailed implements Action {
  readonly type = ActionTypes.LOAD_SERVER_EDITOR_SESSION_FAILED;
  constructor(public payload: { error: string }) {}
}

export class UpdateEditorSessionFailed implements Action {
  readonly type = ActionTypes.UPDATE_EDITOR_SESSION_FAILED;
  constructor(public payload: { error: string }) {}
}

export class DeleteEditorSessionFailed implements Action {
  readonly type = ActionTypes.DELETE_EDITOR_SESSION_FAILED;
  constructor(public payload: { error: string }) {}
}

export class LoadActiveEditorSessionsFailed implements Action {
  readonly type = ActionTypes.LOAD_ACTIVE_EDITOR_SESSIONS_FAILED;
  constructor(public payload: { error: string }) {}
}

export class DisconnectActiveEditorSessionsFailed implements Action {
  readonly type = ActionTypes.DISCONNECT_ACTIVE_EDITOR_SESSIONS_FAILED;
  constructor(public payload: { error: string }) {}
}

export type Actions =
UserDataRequested |
UserDataLoaded |
StoreUserDataRequested |
StoreUserDataComplete |
UpdatePasswordRequested |
UpdatePasswordComplete |
LoadServerEditorSessionRequested |
LoadCurrentEditorSessionComplete |
CreateEditorSessionRequested |
CreateEditorSessionComplete |
UpdateEditorSessionRequested |
UpdateEditorSessionComplete |
DeleteEditorSessionRequested |
DeleteEditorSessionComplete |
LoadActiveEditorSessionsRequested |
LoadActiveEditorSessionsComplete |
DisconnectActiveEditorSessionsRequested |
DisconnectActiveEditorSessionsComplete |
PurgeEditorSessionData |
LoadErrorDetected |
LoadCurrentEditorSessionFailed |
CreateEditorSessionFailed |
UpdateEditorSessionFailed |
DeleteEditorSessionFailed |
LoadActiveEditorSessionsFailed |
DisconnectActiveEditorSessionsFailed
;
