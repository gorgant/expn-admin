import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { DataImportsComponent } from '../components/data-imports/data-imports.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'orders',
    loadChildren: '../components/orders/modules/orders.module#OrdersModule',
  },
  {
    path: 'blog',
    loadChildren: '../components/blog/modules/blog.module#BlogModule',
  },
  {
    path: 'products',
    loadChildren: '../components/products/modules/products.module#ProductsModule',
  },
  {
    path: 'subscribers',
    loadChildren: '../components/subscribers/modules/subscribers.module#SubscribersModule',
  },
  {
    path: 'data-imports',
    component: DataImportsComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
