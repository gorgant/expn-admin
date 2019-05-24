import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactFormDashboardComponent } from '../components/contact-form-dashboard/contact-form-dashboard.component';
import { ContactFormPageComponent } from '../components/contact-form-page/contact-form-page.component';

const routes: Routes = [
  {
    path: 'dashboard', component: ContactFormDashboardComponent
  },
  {
    path: 'existing/:id', component: ContactFormPageComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactFormsRoutingModule { }
