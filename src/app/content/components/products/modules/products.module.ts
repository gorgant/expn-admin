import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductDashboardComponent } from '../components/product-dashboard/product-dashboard.component';
import { ProductFormComponent } from '../components/product-form/product-form.component';

@NgModule({
  declarations: [ProductDashboardComponent, ProductFormComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
