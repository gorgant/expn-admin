import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscriberDashboardComponent } from '../components/subscriber-dashboard/subscriber-dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard', component: SubscriberDashboardComponent
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
export class SubscribersRoutingModule { }
