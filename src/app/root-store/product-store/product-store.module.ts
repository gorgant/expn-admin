import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProductStoreEffects } from './effects';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(AdminFeatureNames.PRODUCTS, featureReducer),
    EffectsModule.forFeature([ProductStoreEffects])
  ],
  providers: [ProductStoreEffects]
})
export class ProductStoreModule { }
