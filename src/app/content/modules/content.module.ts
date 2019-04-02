import { NgModule } from '@angular/core';

import { ContentRoutingModule } from './content-routing.module';
import { HomeComponent } from '../home/home.component';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    ContentRoutingModule
  ]
})
export class ContentModule { }
