import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCoupons from './reducer';
import { DiscountCouponParent } from 'shared-models/billing/discount-coupon.model';

const getIsLoading = (state: State): boolean => state.isLoading;
const getIsSaving = (state: State): boolean => state.isSaving;
const getIsDeleting = (state: State): boolean => state.isDeleting;
const getLoadError = (state: State): any => state.loadError;
const getSaveError = (state: State): boolean => state.saveError;
const getDeleteError = (state: State): boolean => state.deleteError;
const getCouponsLoaded = (state: State): boolean => state.couponsLoaded;
const getCouponSaved = (state: State): boolean => state.couponSaved;

export const selectCouponState: MemoizedSelector<object, State>
= createFeatureSelector<State>('coupons');

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

export const selectLoaded: MemoizedSelector<object, boolean>
= createSelector(selectCouponState, getCouponsLoaded);

export const selectIsSaving: MemoizedSelector<object, boolean>
= createSelector(selectCouponState, getIsSaving);

export const selectCouponSaved: MemoizedSelector<object, boolean>
= createSelector(selectCouponState, getCouponSaved);

export const selectIsDeleting: MemoizedSelector<object, boolean>
= createSelector(selectCouponState, getIsDeleting);



