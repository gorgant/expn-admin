import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { DataImportsComponent } from '../data-imports/data-imports.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'blog',
    loadChildren: '../blog/modules/blog.module#BlogModule',
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
