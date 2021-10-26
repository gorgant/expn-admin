import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { environment } from '../environments/environment';
import { NavigationModule } from './navigation/modules/navigation.module';
import { RootStoreModule } from './root-store';
import { SharedModule } from './shared/shared.module';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    RootStoreModule,
    NavigationModule,
    AppRoutingModule,
  ],
  providers: [
    // { provide: AngularfirestoreAdminFunctionsService, deps: [PLATFORM_ID, NgZone], useFactory: AngularfirestoreAdminFunctionsFactory },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
