import { NgModule } from '@angular/core';

import { SubscribersRoutingModule } from './subscribers-routing.module';
import { SubscriberDashboardComponent } from '../components/subscriber-dashboard/subscriber-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FetchSubscriberComponent } from '../components/fetch-subscriber/fetch-subscriber.component';
import { ExportSubscribersComponent } from '../components/export-subscribers/export-subscribers.component';
import { SubscriberCountComponent } from '../components/subscriber-count/subscriber-count.component';

@NgModule({
  declarations: [
    SubscriberDashboardComponent,
    FetchSubscriberComponent,
    ExportSubscribersComponent,
    SubscriberCountComponent
  ],
  imports: [
    SharedModule,
    SubscribersRoutingModule
  ]
})
export class SubscribersModule { }
