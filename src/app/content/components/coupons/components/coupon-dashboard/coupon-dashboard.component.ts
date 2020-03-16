import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DiscountCouponParent, DiscountCouponQueryFields } from 'shared-models/billing/discount-coupon.model';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { RootStoreState, CouponStoreSelectors, CouponStoreActions } from 'src/app/root-store';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { withLatestFrom, map } from 'rxjs/operators';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { CouponFormComponent } from '../coupon-form/coupon-form.component';

@Component({
  selector: 'app-coupon-dashboard',
  templateUrl: './coupon-dashboard.component.html',
  styleUrls: ['./coupon-dashboard.component.scss']
})
export class CouponDashboardComponent implements OnInit, OnDestroy {

  coupons$: Observable<DiscountCouponParent[]>;
  private couponsSubscription: Subscription;
  couponObjectKeys = DiscountCouponQueryFields;

  displayedColumns = [
    this.couponObjectKeys.COUPON_CODE,
    this.couponObjectKeys.DISCOUNT_PERCENTAGE,
    this.couponObjectKeys.USE_COUNT,
    this.couponObjectKeys.ACTIVE,
    this.couponObjectKeys.CREATED_DATE
  ];
  dataSource = new MatTableDataSource<DiscountCouponParent>();
  isLoading$: Observable<boolean>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private store$: Store<RootStoreState.State>,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.initializeCoupons();
    this.initializeMatTable();
    this.initBreakpointObserver();
  }

  onSelectCoupon(coupon: DiscountCouponParent) {
    this.router.navigate([AdminAppRoutes.COUPONS_COUPON_DETAILS, coupon.couponCode]);
  }

  onCreateCoupon() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(CouponFormComponent, dialogConfig);
  }

  private initializeCoupons() {
    this.isLoading$ = this.store$.select(CouponStoreSelectors.selectIsLoading);

    this.coupons$ = this.store$.select(CouponStoreSelectors.selectAllCoupons)
      .pipe(
        withLatestFrom(
          this.store$.select(CouponStoreSelectors.selectLoaded)
        ),
        map(([coupons, couponsLoaded]) => {
          // Check if items are loaded, if not fetch from server
          if (!couponsLoaded) {
            this.store$.dispatch(new CouponStoreActions.AllCouponsRequested());
          }
          return coupons;
        })
      );
  }

  private initializeMatTable() {
    this.couponsSubscription = this.coupons$.subscribe(coupons => this.dataSource.data = coupons); // Supply data
    this.dataSource.sort = this.sort; // Configure sorting on headers
    this.dataSource.paginator = this.paginator; // Configure pagination
  }

  private initBreakpointObserver() {
    this.breakpointObserver.observe(['(max-width: 959px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.displayedColumns = [
            this.couponObjectKeys.COUPON_CODE,
            this.couponObjectKeys.DISCOUNT_PERCENTAGE,
            this.couponObjectKeys.USE_COUNT,
            this.couponObjectKeys.ACTIVE,
          ];
        } else {
          this.displayedColumns = [
            this.couponObjectKeys.COUPON_CODE,
            this.couponObjectKeys.DISCOUNT_PERCENTAGE,
            this.couponObjectKeys.USE_COUNT,
            this.couponObjectKeys.ACTIVE,
            this.couponObjectKeys.CREATED_DATE
          ];
        }
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.couponsSubscription) {
      this.couponsSubscription.unsubscribe();
    }
  }

}
