import { NgModule } from '@angular/core';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogDashboardComponent } from '../components/blog-dashboard/blog-dashboard.component';
import { BlogFormComponent } from '../components/blog-form/blog-form.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    BlogDashboardComponent,
    BlogFormComponent,
  ],
  imports: [
    SharedModule,
    BlogRoutingModule,
    CKEditorModule,
  ]
})
export class BlogModule { }
