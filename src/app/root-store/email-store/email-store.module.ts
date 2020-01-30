import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EmailStoreEffects } from './effects';
import { featureReducer } from './reducer';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('email', featureReducer),
    EffectsModule.forFeature([EmailStoreEffects])
  ]
})
export class EmailStoreModule { }
