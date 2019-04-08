import { NgModule } from '@angular/core';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogDashboardComponent } from '../components/blog-dashboard/blog-dashboard.component';
import { PostFormComponent } from '../components/post-form/post-form.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PostPreviewComponent } from '../components/post-preview/post-preview.component';

@NgModule({
  declarations: [
    BlogDashboardComponent,
    PostFormComponent,
    PostPreviewComponent,
  ],
  imports: [
    SharedModule,
    BlogRoutingModule,
    CKEditorModule,
  ]
})
export class BlogModule { }
