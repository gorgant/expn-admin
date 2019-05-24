import { NgModule } from '@angular/core';

import { ContactFormsRoutingModule } from './contact-forms-routing.module';
import { ContactFormDashboardComponent } from '../components/contact-form-dashboard/contact-form-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactFormPageComponent } from '../components/contact-form-page/contact-form-page.component';

@NgModule({
  declarations: [ContactFormDashboardComponent, ContactFormPageComponent],
  imports: [
    SharedModule,
    ContactFormsRoutingModule
  ]
})
export class ContactFormsModule { }
