import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { SubscriberStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('subscribers', featureReducer),
    EffectsModule.forFeature([SubscriberStoreEffects])
  ],
  providers: [SubscriberStoreEffects]
})
export class SubscriberStoreModule { }
