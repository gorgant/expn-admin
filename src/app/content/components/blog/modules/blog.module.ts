import { NgModule } from '@angular/core';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogDashboardComponent } from '../components/blog-dashboard/blog-dashboard.component';
import { PostFormComponent } from '../components/post-form/post-form.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PostPreviewComponent } from '../components/post-preview/post-preview.component';
import { PostCardComponent } from '../components/post-card/post-card.component';
import { SchedulePostDialogueComponent } from '../components/schedule-post-dialogue/schedule-post-dialogue.component';

@NgModule({
  declarations: [
    BlogDashboardComponent,
    PostFormComponent,
    PostPreviewComponent,
    PostCardComponent,
    SchedulePostDialogueComponent,
  ],
  imports: [
    SharedModule,
    BlogRoutingModule,
    CKEditorModule,
  ],
  entryComponents: [
    SchedulePostDialogueComponent
  ]
})
export class BlogModule { }
