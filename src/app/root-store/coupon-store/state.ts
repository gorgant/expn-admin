import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { DiscountCouponParent } from 'shared-models/billing/discount-coupon.model';

export const featureAdapter: EntityAdapter<DiscountCouponParent>
  = createEntityAdapter<DiscountCouponParent>(
    {
      selectId: (coupon: DiscountCouponParent) => coupon.couponCode,
      // Sort by reverse date
      sortComparer: (a: DiscountCouponParent, b: DiscountCouponParent): number => {
        const createdDateA = a.createdDate;
        const createdDateB = b.createdDate;
        return createdDateB.toString().localeCompare(createdDateA.toString(), undefined, {numeric: true});
      }
    }
  );

export interface State extends EntityState<DiscountCouponParent> {
  isLoading?: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  loadError: any;
  saveError: any;
  deleteError: any;
  couponsLoaded?: boolean;
  couponSaved: boolean;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    isSaving: false,
    isDeleting: false,
    loadError: null,
    saveError: null,
    deleteError: null,
    couponsLoaded: false,
    couponSaved: false,
  }
);
