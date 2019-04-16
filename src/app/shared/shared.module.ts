import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DeleteConfirmDialogueComponent } from './components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { PublishedPostPipe } from './pipes/published-post.pipe';
import { UnpublishedPostPipe } from './pipes/unpublished-post.pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    DeleteConfirmDialogueComponent,
    PublishedPostPipe,
    UnpublishedPostPipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PublishedPostPipe,
    UnpublishedPostPipe,
    HttpClientModule
  ],
  entryComponents: [
    DeleteConfirmDialogueComponent
  ]
})
export class SharedModule { }
