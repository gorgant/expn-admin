import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { PostStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('posts', featureReducer),
    EffectsModule.forFeature([PostStoreEffects])
  ],
  providers: [PostStoreEffects]
})
export class PostStoreModule { }
