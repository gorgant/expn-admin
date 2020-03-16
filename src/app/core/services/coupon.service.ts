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
          console.log('Error getting coupons', error);
          this.uiService.showSnackBar(error, null, 5000);
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
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error);
      })
    );
  }

  // createCoupon(coupon: DiscountCouponParent): Observable<DiscountCouponParent> {
  //   const fbResponse = this.getCouponDoc(coupon.couponCode).set(coupon)
  //     .then(empty => {
  //       console.log('Coupon created', coupon);
  //       return coupon;
  //     })
  //     .catch(error => {
  //       console.log('Error creating coupon', error);
  //       return error;
  //     });

  //   return from(fbResponse);
  // }

  updateCoupon(coupon: DiscountCouponParent): Observable<DiscountCouponParent> {
    const fbResponse = this.getCouponDoc(coupon.couponCode).set(coupon, {merge: true})
      .then(empty => {
        console.log('Coupon updated', coupon);
        return coupon;
      })
      .catch(error => {
        console.log('Error updating coupon', error);
        return error;
      });

    return from(fbResponse);
  }

  deleteCoupon(couponId: string): Observable<string> {

    const fbResponse = this.getCouponDoc(couponId).delete()
      .then(empty => {
        console.log('Coupon deleted', couponId);
        return couponId;
      })
      .catch(error => {
        console.log('Error deleting coupon', error);
        return throwError(error).toPromise();
      });

    return from(fbResponse);
  }

  getCouponDoc(id: string): AngularFirestoreDocument<DiscountCouponParent> {
    return this.getCouponCollection().doc(id);
  }

  private getCouponCollection(): AngularFirestoreCollection<DiscountCouponParent> {
    return this.afs.collection<DiscountCouponParent>(AdminCollectionPaths.DISCOUNT_COUPONS);
  }
}
