import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDashboardComponent } from '../components/product-dashboard/product-dashboard.component';
import { ProductFormComponent } from '../components/product-form/product-form.component';

const routes: Routes = [
  {
    path: 'dashboard', component: ProductDashboardComponent
  },
  {
    path: 'new', component: ProductFormComponent
  },
  {
    path: 'existing/:id', component: ProductFormComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
