import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { DiscountCouponParent } from 'shared-models/billing/discount-coupon.model';

export enum ActionTypes {
  SINGLE_COUPON_REQUESTED = '[Coupons] Single Coupon Requested',
  SINGLE_COUPON_LOADED = '[Coupons] Single Coupon Loaded',
  ALL_COUPONS_REQUESTED = '[Coupons] All Coupons Requested',
  ALL_COUPONS_LOADED = '[Coupons] All Coupons Loaded',
  ADD_COUPON_REQUESTED = '[Coupons] Add Coupon Requested',
  ADD_COUPON_COMPLETE = '[Coupons] Add Coupon Complete',
  UPDATE_COUPON_REQUESTED = '[Coupons] Update Coupon Requested',
  UPDATE_COUPON_COMPLETE = '[Coupons] Update Coupon Complete',
  DELETE_COUPON_REQUESTED = '[Coupons] Delete Coupon Requested',
  DELETE_COUPON_COMPLETE = '[Coupons] Delete Coupon Complete',
  LOAD_FAILED = '[Coupons] Load Failed',
  SAVE_FAILED = '[Coupons] Save Failed',
  DELETE_FAILED = '[Coupons] Delete Failed'
}

export class SingleCouponRequested implements Action {
  readonly type = ActionTypes.SINGLE_COUPON_REQUESTED;
  constructor(public payload: { couponId: string }) {}
}

export class SingleCouponLoaded implements Action {
  readonly type = ActionTypes.SINGLE_COUPON_LOADED;
  constructor(public payload: { coupon: DiscountCouponParent }) {}
}

export class AllCouponsRequested implements Action {
  readonly type = ActionTypes.ALL_COUPONS_REQUESTED;
}

export class AllCouponsLoaded implements Action {
  readonly type = ActionTypes.ALL_COUPONS_LOADED;
  constructor(public payload: { coupons: DiscountCouponParent[] }) {}
}

// export class AddCouponRequested implements Action {
//   readonly type = ActionTypes.ADD_COUPON_REQUESTED;

//   constructor(public payload: { coupon: DiscountCouponParent }) {}
// }

// export class AddCouponComplete implements Action {
//   readonly type = ActionTypes.ADD_COUPON_COMPLETE;

//   constructor(public payload: { coupon: DiscountCouponParent }) {}
// }

export class UpdateCouponRequested implements Action {
  readonly type = ActionTypes.UPDATE_COUPON_REQUESTED;

  constructor(public payload: { coupon: DiscountCouponParent }) {}
}

export class UpdateCouponComplete implements Action {
  readonly type = ActionTypes.UPDATE_COUPON_COMPLETE;

  constructor(public payload: { coupon: Update<DiscountCouponParent> }) {}
}

export class DeleteCouponRequested implements Action {
  readonly type = ActionTypes.DELETE_COUPON_REQUESTED;

  constructor(public payload: { couponId: string }) {}
}

export class DeleteCouponComplete implements Action {
  readonly type = ActionTypes.DELETE_COUPON_COMPLETE;

  constructor(public payload: {couponId: string}) {}
}

export class LoadFailed implements Action {
  readonly type = ActionTypes.LOAD_FAILED;
  constructor(public payload: { error: string }) {}
}

export class SaveFailed implements Action {
  readonly type = ActionTypes.SAVE_FAILED;
  constructor(public payload: { error: string }) {}
}

export class DeleteFailed implements Action {
  readonly type = ActionTypes.DELETE_FAILED;
  constructor(public payload: { error: string }) {}
}

export type Actions =
  SingleCouponRequested |
  SingleCouponLoaded |
  AllCouponsRequested |
  AllCouponsLoaded |
  // AddCouponRequested |
  // AddCouponComplete |
  UpdateCouponRequested |
  UpdateCouponComplete |
  DeleteCouponRequested |
  DeleteCouponComplete |
  LoadFailed |
  SaveFailed |
  DeleteFailed
  ;
