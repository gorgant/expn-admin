import { Action } from '@ngrx/store';
import { Order } from 'shared-models/orders/order.model';

export enum ActionTypes {
  SINGLE_ORDER_REQUESTED = '[Orders] Single Order Requested',
  SINGLE_ORDER_LOADED = '[Orders] Single Order Loaded',
  ALL_ORDERS_REQUESTED = '[Orders] All Orders Requested',
  ALL_ORDERS_LOADED = '[Orders] All Orders Loaded',
  LOAD_FAILURE = '[Orders] Load Failure',
}

export class SingleOrderRequested implements Action {
  readonly type = ActionTypes.SINGLE_ORDER_REQUESTED;
  constructor(public payload: { orderId: string }) {}
}

export class SingleOrderLoaded implements Action {
  readonly type = ActionTypes.SINGLE_ORDER_LOADED;
  constructor(public payload: { order: Order }) {}
}

export class AllOrdersRequested implements Action {
  readonly type = ActionTypes.ALL_ORDERS_REQUESTED;
}

export class AllOrdersLoaded implements Action {
  readonly type = ActionTypes.ALL_ORDERS_LOADED;
  constructor(public payload: { orders: Order[] }) {}
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.LOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export type Actions =
  SingleOrderRequested |
  SingleOrderLoaded |
  AllOrdersRequested |
  AllOrdersLoaded |
  LoadErrorDetected
  ;
