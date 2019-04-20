import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, NgZone } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { environment } from '../environments/environment';
import { NavigationModule } from './navigation/modules/navigation.module';
import { RootStoreModule } from './root-store';
import { CoreModule } from './core/modules/core.module';
import { SharedModule } from './shared/shared.module';
import { ProductServiceModule } from './core/modules/product-service.module';
import { PostServiceModule } from './core/modules/post-service.module';
import {
  AngularfirestoreAdminFunctionsService,
  AngularfirestoreAdminFunctionsFactory
} from './core/services/angular-firestore-extension.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    ProductServiceModule,
    PostServiceModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.admin),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    RootStoreModule,
    NavigationModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: AngularfirestoreAdminFunctionsService, deps: [PLATFORM_ID, NgZone], useFactory: AngularfirestoreAdminFunctionsFactory },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
