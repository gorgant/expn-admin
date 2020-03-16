import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscountCouponParent } from 'shared-models/billing/discount-coupon.model';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, CouponStoreSelectors, CouponStoreActions, ProductStoreSelectors, ProductStoreActions } from 'src/app/root-store';
import { ActivatedRoute, Router } from '@angular/router';
import { withLatestFrom, map, take } from 'rxjs/operators';
import { MatSlideToggleChange, MatDialogConfig, MatDialog } from '@angular/material';
import { CouponFormComponent } from '../coupon-form/coupon-form.component';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { Product } from 'shared-models/products/product.model';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.component.html',
  styleUrls: ['./coupon-details.component.scss']
})
export class CouponDetailsComponent implements OnInit, OnDestroy {

  coupon$: Observable<DiscountCouponParent>;
  private couponLoaded: boolean;

  products$: Observable<Product[]>;

  deleteCouponSubscription: Subscription;

  constructor(
    private store$: Store<RootStoreState.State>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.initializeProducts();
    this.loadExistingCouponData();
  }

  onToggleActivate(event: MatSlideToggleChange) {
    console.log('Toggle value', event.checked);
    this.coupon$.pipe(
      take(1)
    ).subscribe(coupon => {
      const activationUpdate: Partial<DiscountCouponParent> = {
        couponCode: coupon.couponCode,
        active: event.checked
      };
      const couponUpdateWrapper = activationUpdate as DiscountCouponParent;
      this.store$.dispatch(new CouponStoreActions.UpdateCouponRequested({coupon: couponUpdateWrapper}));
    });
  }

  onEditCoupon() {
    this.coupon$.pipe(
      take(1)
    ).subscribe(coupon => {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '400px';
      dialogConfig.data = coupon;

      const dialogRef = this.dialog.open(CouponFormComponent, dialogConfig);
    });
  }

  onDeleteCoupon() {
    this.coupon$.pipe(
      take(1)
    ).subscribe(coupon => {
      this.store$.dispatch(new CouponStoreActions.DeleteCouponRequested({couponId: coupon.couponCode}));

      // Navigate to dashboard once deletion is complete
      this.deleteCouponSubscription = this.store$.select(CouponStoreSelectors.selectIsDeleting).pipe(
        withLatestFrom(this.store$.select(CouponStoreSelectors.selectDeleteError))
      ).subscribe(([isDeleting, deleteError]) => {
        if (!isDeleting && !deleteError) {
          this.router.navigate([AdminAppRoutes.COUPONS_DASHBOARD]);
        }
      });
    });
  }

  private loadExistingCouponData() {
    // Check if id params are available
    const idParamName = 'id';
    const idParam = this.route.snapshot.params[idParamName];
    if (idParam) {
      console.log('Coupon detected with id', idParam);
      this.coupon$ = this.getCoupon(idParam);
    }
  }

  private getCoupon(couponId: string): Observable<DiscountCouponParent> {
    console.log('Getting coupon', couponId);
    return this.store$.select(CouponStoreSelectors.selectCouponById(couponId))
      .pipe(
        withLatestFrom(
          this.store$.select(CouponStoreSelectors.selectLoaded)
        ),
        map(([coupon, couponsLoaded]) => {
          // Check if items are loaded, if not fetch from server
          if (!couponsLoaded && !this.couponLoaded) {
            console.log('No coupon in store, fetching from server', couponId);
            this.store$.dispatch(new CouponStoreActions.SingleCouponRequested({couponId}));
          }
          console.log('Single coupon status', this.couponLoaded);
          this.couponLoaded = true; // Prevents loading from firing more than needed
          return coupon;
        })
      );
  }

  private initializeProducts() {
    this.products$ = this.store$.select(ProductStoreSelectors.selectAllProducts)
      .pipe(
        withLatestFrom(
          this.store$.select(ProductStoreSelectors.selectProductsLoaded)
        ),
        map(([products, productsLoaded]) => {
          // Check if items are loaded, if not fetch from server
          if (!productsLoaded) {
            this.store$.dispatch(new ProductStoreActions.AllProductsRequested());
          }
          if (productsLoaded) {
            return products;
            console.log('Returning product list');
          }
        })
      );
  }

  ngOnDestroy() {

    if (this.deleteCouponSubscription) {
      this.deleteCouponSubscription.unsubscribe();
    }

  }

}
