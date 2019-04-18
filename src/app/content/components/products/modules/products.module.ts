import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductDashboardComponent } from '../components/product-dashboard/product-dashboard.component';
import { ProductFormComponent } from '../components/product-form/product-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ProductDashboardComponent, ProductFormComponent],
  imports: [
    SharedModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
