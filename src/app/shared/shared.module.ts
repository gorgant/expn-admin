import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DeleteConfirmDialogueComponent } from './components/delete-confirm-dialogue/delete-confirm-dialogue.component';

@NgModule({
  declarations: [
    DeleteConfirmDialogueComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  entryComponents: [
    DeleteConfirmDialogueComponent
  ]
})
export class SharedModule { }
