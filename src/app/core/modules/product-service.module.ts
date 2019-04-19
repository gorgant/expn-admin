import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { FirebasePaths } from '../models/routes-and-paths/firebase-paths.model';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    AngularFireStorageModule
  ],
  providers: [
    {provide: StorageBucket, useValue: FirebasePaths.PRODUCTS_STORAGE_AF}
  ]
})
export class ProductServiceModule { }
