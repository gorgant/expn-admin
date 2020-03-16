import { NgModule } from '@angular/core';

import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponFormComponent } from '../components/coupon-form/coupon-form.component';
import { CouponDashboardComponent } from '../components/coupon-dashboard/coupon-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CouponDetailsComponent } from '../components/coupon-details/coupon-details.component';


@NgModule({
  declarations: [
    CouponFormComponent,
    CouponDashboardComponent,
    CouponDetailsComponent
  ],
  imports: [
    SharedModule,
    CouponsRoutingModule
  ],
  entryComponents: [
    CouponFormComponent
  ]
})
export class CouponsModule { }
