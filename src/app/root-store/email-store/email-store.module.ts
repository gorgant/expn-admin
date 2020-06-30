import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EmailStoreEffects } from './effects';
import { featureReducer } from './reducer';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(AdminFeatureNames.EMAIL, featureReducer),
    EffectsModule.forFeature([EmailStoreEffects])
  ]
})
export class EmailStoreModule { }
