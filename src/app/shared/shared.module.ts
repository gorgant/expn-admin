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
import { MatElevationDirective } from './directives/mat-elevation.directive';
import { ProductIdToNamePipe } from './pipes/product-id-to-name.pipe';
import { PageHeroComponent } from './components/page-hero/page-hero.component';
import { ServiceProductPipe } from './pipes/service-product.pipe';
import { WebcourseProductPipe } from './pipes/webcourse-product.pipe';

@NgModule({
  declarations: [
    DeleteConfirmDialogueComponent,
    PublishedPostPipe,
    UnpublishedPostPipe,
    MatElevationDirective,
    ProductIdToNamePipe,
    ServiceProductPipe,
    WebcourseProductPipe,
    PageHeroComponent
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
    HttpClientModule,
    MatElevationDirective,
    ProductIdToNamePipe,
    PageHeroComponent,
    ServiceProductPipe,
    WebcourseProductPipe,
  ],
  entryComponents: [
    DeleteConfirmDialogueComponent
  ]
})
export class SharedModule { }
