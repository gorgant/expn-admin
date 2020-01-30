import { Action } from '@ngrx/store';

export enum ActionTypes {
  SEND_TEST_EMAIL_REQUESTED = '[Email] Send Test Email Requested',
  SEND_TEST_EMAIL_COMPLETE = '[Email] Send Test Email Complete',
  LOAD_FAILURE = '[Email] Load Failure',
}

export class SendTestEmailRequested implements Action {
  readonly type = ActionTypes.SEND_TEST_EMAIL_REQUESTED;
  constructor(public payload: { emailContent: string }) {}
}

export class SendTestEmailComplete implements Action {
  readonly type = ActionTypes.SEND_TEST_EMAIL_COMPLETE;
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.LOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export type Actions =
  SendTestEmailRequested |
  SendTestEmailComplete |
  LoadErrorDetected
  ;
