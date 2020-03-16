import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { CouponStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('coupons', featureReducer),
    EffectsModule.forFeature([CouponStoreEffects])
  ],
  providers: [CouponStoreEffects]
})
export class CouponStoreModule { }
