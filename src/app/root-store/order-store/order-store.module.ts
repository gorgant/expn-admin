import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { OrderStoreEffects } from './effects';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(AdminFeatureNames.ORDERS, featureReducer),
    EffectsModule.forFeature([OrderStoreEffects])
  ],
  providers: [OrderStoreEffects]
})
export class OrderStoreModule { }
