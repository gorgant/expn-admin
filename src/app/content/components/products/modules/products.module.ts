import { NgModule } from '@angular/core';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductDashboardComponent } from '../components/product-dashboard/product-dashboard.component';
import { ProductFormComponent } from '../components/product-form/product-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductCardComponent } from '../components/product-card/product-card.component';

@NgModule({
  declarations: [
    ProductDashboardComponent,
    ProductFormComponent,
    ProductCardComponent
  ],
  imports: [
    SharedModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
