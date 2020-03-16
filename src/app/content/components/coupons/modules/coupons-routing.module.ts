import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponDashboardComponent } from '../components/coupon-dashboard/coupon-dashboard.component';
import { CouponDetailsComponent } from '../components/coupon-details/coupon-details.component';


const routes: Routes = [
  {
    path: 'dashboard', component: CouponDashboardComponent
  },
  {
    path: 'existing/:id', component: CouponDetailsComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
