import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthStoreEffects } from './effects';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(AdminFeatureNames.AUTH, featureReducer),
    EffectsModule.forFeature([AuthStoreEffects])
  ],
  providers: [AuthStoreEffects]
})
export class AuthStoreModule { }
