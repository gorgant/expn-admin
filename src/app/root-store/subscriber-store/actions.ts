import { Action } from '@ngrx/store';
import { EmailSubscriber } from 'shared-models/subscribers/email-subscriber.model';

export enum ActionTypes {
  SINGLE_SUBSCRIBER_REQUESTED = '[Subscribers] Single Subscriber Requested',
  SINGLE_SUBSCRIBER_LOADED = '[Subscribers] Single Subscriber Loaded',
  ALL_SUBSCRIBERS_REQUESTED = '[Subscribers] All Subscribers Requested',
  ALL_SUBSCRIBERS_LOADED = '[Subscribers] All Subscribers Loaded',
  LOAD_FAILURE = '[Subscribers] Load Failure',
}

export class SingleSubscriberRequested implements Action {
  readonly type = ActionTypes.SINGLE_SUBSCRIBER_REQUESTED;
  constructor(public payload: { subscriberId: string }) {}
}

export class SingleSubscriberLoaded implements Action {
  readonly type = ActionTypes.SINGLE_SUBSCRIBER_LOADED;
  constructor(public payload: { subscriber: EmailSubscriber }) {}
}

export class AllSubscribersRequested implements Action {
  readonly type = ActionTypes.ALL_SUBSCRIBERS_REQUESTED;
}

export class AllSubscribersLoaded implements Action {
  readonly type = ActionTypes.ALL_SUBSCRIBERS_LOADED;
  constructor(public payload: { subscribers: EmailSubscriber[] }) {}
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.LOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export type Actions =
  SingleSubscriberRequested |
  SingleSubscriberLoaded |
  AllSubscribersRequested |
  AllSubscribersLoaded |
  LoadErrorDetected
  ;
