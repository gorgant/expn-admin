import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map, takeUntil, catchError, take } from 'rxjs/operators';
import { Observable, throwError, from } from 'rxjs';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';
import { AdminCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';
import { DiscountCouponParent } from 'shared-models/billing/discount-coupon.model';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(
    private afs: AngularFirestore,
    private uiService: UiService,
    private authService: AuthService,
  ) { }

  fetchAllCoupons(): Observable<DiscountCouponParent[]> {
    const couponCollection = this.getCouponCollection();
    return couponCollection.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(coupons => {
          console.log('Fetched all coupons', coupons);
          return coupons;
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          console.log('Error fetching all coupons', error);
          return throwError(error);
        })
      );
  }

  fetchSingleCoupon(id: string): Observable<DiscountCouponParent> {
    const couponDoc = this.getCouponDoc(id);
    return couponDoc.valueChanges()
      .pipe(
        take(1), // Prevents load attempts after deletion
        map(coupon => {
          console.log('Fetched this item', coupon);
          return coupon;
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          console.log('Error fetching single coupon', error);
          return throwError(error);
        })
      );
  }

  updateCoupon(coupon: DiscountCouponParent): Observable<DiscountCouponParent> {
    const fbResponse = from(this.getCouponDoc(coupon.couponCode).set(coupon, {merge: true}));
    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('Coupon updated', coupon);
        return coupon;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error updating coupon', error);
        return throwError(error);
      })
    );
  }

  deleteCoupon(couponId: string): Observable<string> {
    const fbResponse = from(this.getCouponDoc(couponId).delete());
    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('Coupon deleted', couponId);
        return couponId;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error deleting coupon', error);
        return throwError(error);
      })
    );
  }

  getCouponDoc(id: string): AngularFirestoreDocument<DiscountCouponParent> {
    return this.getCouponCollection().doc(id);
  }

  private getCouponCollection(): AngularFirestoreCollection<DiscountCouponParent> {
    return this.afs.collection<DiscountCouponParent>(AdminCollectionPaths.DISCOUNT_COUPONS);
  }
}
