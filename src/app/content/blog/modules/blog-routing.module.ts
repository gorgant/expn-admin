import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogDashboardComponent } from '../components/blog-dashboard/blog-dashboard.component';
import { BlogFormComponent } from '../components/blog-form/blog-form.component';

const routes: Routes = [
  {
    path: 'dashboard', component: BlogDashboardComponent
  },
  {
    path: 'new', component: BlogFormComponent
  },
  {
    path: ':id', component: BlogFormComponent
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
export class BlogRoutingModule { }
