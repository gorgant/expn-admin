import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { PodcastStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('podcast', featureReducer),
    EffectsModule.forFeature([PodcastStoreEffects])
  ],
  providers: [PodcastStoreEffects]
})
export class PodcastStoreModule { }
