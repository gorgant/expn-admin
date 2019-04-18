import { NgModule } from '@angular/core';

import { ContentRoutingModule } from './content-routing.module';
import { HomeComponent } from '../components/home/home.component';
import { DataImportsComponent } from '../components/data-imports/data-imports.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    DataImportsComponent,
  ],
  imports: [
    SharedModule,
    ContentRoutingModule
  ]
})
export class ContentModule { }
