import { NgModule } from '@angular/core';

import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogDashboardComponent } from '../components/blog-dashboard/blog-dashboard.component';
import { BlogFormComponent } from '../components/blog-form/blog-form.component';

@NgModule({
  declarations: [
    BlogDashboardComponent,
    BlogFormComponent
  ],
  imports: [
    SharedModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
