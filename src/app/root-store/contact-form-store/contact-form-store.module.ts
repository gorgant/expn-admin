import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { ContactFormStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('contactForms', featureReducer),
    EffectsModule.forFeature([ContactFormStoreEffects])
  ],
  providers: [ContactFormStoreEffects]
})
export class ContactFormStoreModule { }
