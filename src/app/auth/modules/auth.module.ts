import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from '../components/login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    AngularFireAuthModule,
  ]
})
export class AuthModule { }
