import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogDashboardComponent } from '../components/blog-dashboard/blog-dashboard.component';
import { PostFormComponent } from '../components/post-form/post-form.component';
import { PostPreviewComponent } from '../components/post-preview/post-preview.component';

const routes: Routes = [
  {
    path: 'dashboard', component: BlogDashboardComponent
  },
  {
    path: 'new', component: PostFormComponent
  },
  {
    path: 'existing/:id', component: PostFormComponent
  },
  {
    path: 'preview/:id/:postTitle', component: PostPreviewComponent
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
