import { NgModule } from '@angular/core';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrderPageComponent } from '../components/order-page/order-page.component';
import { OrdersDashboardComponent } from '../components/orders-dashboard/orders-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [OrdersDashboardComponent, OrderPageComponent, OrdersDashboardComponent],
  imports: [
    SharedModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
