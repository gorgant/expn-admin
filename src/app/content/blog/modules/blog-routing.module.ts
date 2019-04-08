import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogDashboardComponent } from '../components/blog-dashboard/blog-dashboard.component';
import { BlogFormComponent } from '../components/blog-form/blog-form.component';
import { BlogPreviewComponent } from '../components/blog-preview/blog-preview.component';

const routes: Routes = [
  {
    path: 'dashboard', component: BlogDashboardComponent
  },
  {
    path: 'new', component: BlogFormComponent
  },
  {
    path: 'existing/:id', component: BlogFormComponent
  },
  {
    path: 'preview/:id', component: BlogPreviewComponent
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
