import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersDashboardComponent } from '../components/orders-dashboard/orders-dashboard.component';
import { OrderPageComponent } from '../components/order-page/order-page.component';

const routes: Routes = [
  {
    path: 'dashboard', component: OrdersDashboardComponent
  },
  {
    path: 'existing/:id', component: OrderPageComponent
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
export class OrdersRoutingModule { }
