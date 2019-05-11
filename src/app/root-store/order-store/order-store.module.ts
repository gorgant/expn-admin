import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { OrderStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('orders', featureReducer),
    EffectsModule.forFeature([OrderStoreEffects])
  ],
  providers: [OrderStoreEffects]
})
export class OrderStoreModule { }
