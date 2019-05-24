import { NgModule } from '@angular/core';

import { SubscribersRoutingModule } from './subscribers-routing.module';
import { SubscriberDashboardComponent } from '../components/subscriber-dashboard/subscriber-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SubscriberDashboardComponent
  ],
  imports: [
    SharedModule,
    SubscribersRoutingModule
  ]
})
export class SubscribersModule { }
