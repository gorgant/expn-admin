import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, NgZone } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { NavigationModule } from './navigation/modules/navigation.module';
import { RootStoreModule } from './root-store';
import { CoreModule } from './core/modules/core.module';
import { SharedModule } from './shared/shared.module';
import {
  AngularfirestoreAdminStoreService,
  AngularfirestorePublicStoreService,
  AngularfirestoreAdminStoreFactory,
  AngularfirestorePublicStoreFactory,
  AngularfirestorePublicAuthService,
  AngularfirestorePublicAuthFactory
} from './core/services/angular-firestore-extension.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.admin),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RootStoreModule,
    NavigationModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: AngularfirestoreAdminStoreService, deps: [PLATFORM_ID, NgZone], useFactory: AngularfirestoreAdminStoreFactory },
    { provide: AngularfirestorePublicStoreService, deps: [PLATFORM_ID, NgZone], useFactory: AngularfirestorePublicStoreFactory },
    { provide: AngularfirestorePublicAuthService, deps: [PLATFORM_ID, NgZone], useFactory: AngularfirestorePublicAuthFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
