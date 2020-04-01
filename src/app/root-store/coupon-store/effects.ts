import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as couponFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { DiscountCouponParent } from 'shared-models/billing/discount-coupon.model';
import { CouponService } from 'src/app/core/services/coupon.service';

@Injectable()
export class CouponStoreEffects {
  constructor(
    private couponService: CouponService,
    private actions$: Actions,
  ) { }

  @Effect()
  singleCouponRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<couponFeatureActions.SingleCouponRequested>(
      couponFeatureActions.ActionTypes.SINGLE_COUPON_REQUESTED
    ),
    mergeMap(action =>
      this.couponService.fetchSingleCoupon(action.payload.couponId)
        .pipe(
          map(coupon => {
            if (!coupon) {
              throw new Error('Coupon not found');
            }
            return new couponFeatureActions.SingleCouponLoaded({ coupon });
          }),
          catchError(error => {
            return of(new couponFeatureActions.LoadFailed({ error }));
          })
        )
    )
  );

  @Effect()
  allCouponsRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<couponFeatureActions.AllCouponsRequested>(
      couponFeatureActions.ActionTypes.ALL_COUPONS_REQUESTED
    ),
    switchMap(action =>
      this.couponService.fetchAllCoupons()
        .pipe(
          map(coupons => {
            if (!coupons) {
              throw new Error('Coupons not found');
            }
            return new couponFeatureActions.AllCouponsLoaded({ coupons });
          }),
          catchError(error => {
            return of(new couponFeatureActions.LoadFailed({ error }));
          })
        )
    )
  );

  @Effect()
  deleteCouponEffect$: Observable<Action> = this.actions$.pipe(
    ofType<couponFeatureActions.DeleteCouponRequested>(
      couponFeatureActions.ActionTypes.DELETE_COUPON_REQUESTED
    ),
    switchMap(action => this.couponService.deleteCoupon(action.payload.couponId)
      .pipe(
          map(couponId => {
            if (!couponId) {
              throw new Error('Error deleting coupon');
            }
            return new couponFeatureActions.DeleteCouponComplete({couponId});
          }),
          catchError(error => {
            return of(new couponFeatureActions.DeleteFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  updateCouponEffect$: Observable<Action> = this.actions$.pipe(
    ofType<couponFeatureActions.UpdateCouponRequested>(
      couponFeatureActions.ActionTypes.UPDATE_COUPON_REQUESTED
    ),
    switchMap(action => this.couponService.updateCoupon(action.payload.coupon)
      .pipe(
          map(coupon => {
            if (!coupon) {
              throw new Error('Error updating coupon');
            }
            const couponUpdate: Update<DiscountCouponParent> = {
              id: coupon.couponCode,
              changes: coupon
            };
            return new couponFeatureActions.UpdateCouponComplete({ coupon: couponUpdate });
          }),
          catchError(error => {
            return of(new couponFeatureActions.SaveFailed({ error }));
          })
        )
    ),
  );
}
