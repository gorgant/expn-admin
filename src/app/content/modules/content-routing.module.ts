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
    loadChildren: () => import('../components/orders/modules/orders.module').then(m => m.OrdersModule),
  },
  {
    path: 'blog',
    loadChildren: () => import('../components/blog/modules/blog.module').then(m => m.BlogModule),
  },
  {
    path: 'products',
    loadChildren: () => import('../components/products/modules/products.module').then(m => m.ProductsModule),
  },
  {
    path: 'subscribers',
    loadChildren: () => import('../components/subscribers/modules/subscribers.module').then(m => m.SubscribersModule),
  },
  {
    path: 'contact-forms',
    loadChildren: () => import('../components/contact-forms/modules/contact-forms.module').then(m => m.ContactFormsModule),
  },
  {
    path: 'data-imports',
    component: DataImportsComponent
  },
  {
    path: 'profile',
    loadChildren: () => import('../components/profile/modules/profile.module').then(m => m.ProfileModule),
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
