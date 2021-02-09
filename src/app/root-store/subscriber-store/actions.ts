import { Action } from '@ngrx/store';
import { EmailSubscriber } from 'shared-models/subscribers/email-subscriber.model';
import { ExportSubscribersParams } from 'shared-models/subscribers/export-subscriber-params.model';
import { SubCountData } from 'shared-models/subscribers/sub-count-data.model';

export enum ActionTypes {
  SINGLE_SUBSCRIBER_REQUESTED = '[Subscribers] Single Subscriber Requested',
  SINGLE_SUBSCRIBER_LOADED = '[Subscribers] Single Subscriber Loaded',
  ALL_SUBSCRIBERS_REQUESTED = '[Subscribers] All Subscribers Requested',
  ALL_SUBSCRIBERS_LOADED = '[Subscribers] All Subscribers Loaded',
  EXPORT_SUBSCRIBERS_REQUESTED = '[Subscribers] Export Subscribers Requested',
  EXPORT_SUBSCRIBERS_COMPLETE = '[Subscribers] Export Subscribers Processed',
  SUBSCRIBER_COUNT_REQUESTED = '[Subscribers] Subscriber Count Requested',
  SUBSCRIBER_COUNT_LOADED = '[Subscribers] Subscriber Count Loaded',
  LOAD_FAILED = '[Subscribers] Load Failure',
  EXPORT_SUBSCRIBERS_FAILED = '[Subscribers] Export Subscribers Failed',
  SUBSCRIBER_COUNT_FAILED = '[Subscribers] Subscriber Count Failed'

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

export class ExportSubscribersRequested implements Action {
  readonly type = ActionTypes.EXPORT_SUBSCRIBERS_REQUESTED;
  constructor(public payload: { exportParams: ExportSubscribersParams }) {}
}

export class ExportSubscribersComplete implements Action {
  readonly type = ActionTypes.EXPORT_SUBSCRIBERS_COMPLETE;
  constructor(public payload: { downloadUrl: string }) {}
}

export class SubscriberCountRequested implements Action {
  readonly type = ActionTypes.SUBSCRIBER_COUNT_REQUESTED;
}

export class SubscriberCountLoaded implements Action {
  readonly type = ActionTypes.SUBSCRIBER_COUNT_LOADED;
  constructor(public payload: { subCountData: SubCountData }) {}
}

export class LoadFailed implements Action {
  readonly type = ActionTypes.LOAD_FAILED;
  constructor(public payload: { error: string }) {}
}

export class ExportSubscribersFailed implements Action {
  readonly type = ActionTypes.EXPORT_SUBSCRIBERS_FAILED;
  constructor(public payload: { error: string }) {}
}

export class SubscriberCountFailed implements Action {
  readonly type = ActionTypes.SUBSCRIBER_COUNT_FAILED;
  constructor(public payload: { error: string }) {}
}

export type Actions =
  SingleSubscriberRequested |
  SingleSubscriberLoaded |
  AllSubscribersRequested |
  AllSubscribersLoaded |
  ExportSubscribersRequested |
  ExportSubscribersComplete |
  SubscriberCountRequested |
  SubscriberCountLoaded |
  LoadFailed |
  ExportSubscribersFailed |
  SubscriberCountFailed
  ;
