import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCoupons from './reducer';
import { DiscountCouponParent } from 'shared-models/billing/discount-coupon.model';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';

const getIsLoading = (state: State): boolean => state.isLoading;
const getIsSaving = (state: State): boolean => state.isSaving;
const getIsDeleting = (state: State): boolean => state.isDeleting;
const getLoadError = (state: State): any => state.loadError;
const getSaveError = (state: State): any => state.saveError;
const getDeleteError = (state: State): any => state.deleteError;
const getCouponsLoaded = (state: State): boolean => state.couponsLoaded;

export const selectCouponState: MemoizedSelector<object, State>
= createFeatureSelector<State>(AdminFeatureNames.COUPON);

export const selectAllCoupons: (state: object) => DiscountCouponParent[] = createSelector(
  selectCouponState,
  fromCoupons.selectAll
);

export const selectCouponById: (couponId: string) => MemoizedSelector<object, DiscountCouponParent>
= (couponId: string) => createSelector(
  selectCouponState,
  couponsState => couponsState.entities[couponId]
);

export const selectLoadError: MemoizedSelector<object, any> = createSelector(
  selectCouponState,
  getLoadError
);

export const selectSaveError: MemoizedSelector<object, any> = createSelector(
  selectCouponState,
  getSaveError
);

export const selectDeleteError: MemoizedSelector<object, any> = createSelector(
  selectCouponState,
  getDeleteError
);

export const selectIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectCouponState, getIsLoading);

export const selectIsSaving: MemoizedSelector<object, boolean>
= createSelector(selectCouponState, getIsSaving);

export const selectIsDeleting: MemoizedSelector<object, boolean>
= createSelector(selectCouponState, getIsDeleting);

export const selectCouponsLoaded: MemoizedSelector<object, boolean>
= createSelector(selectCouponState, getCouponsLoaded);
