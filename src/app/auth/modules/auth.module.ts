import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from '../components/login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ResetPasswordDialogueComponent } from '../components/reset-password-dialogue/reset-password-dialogue.component';

@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordDialogueComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    AngularFireAuthModule,
  ],
  entryComponents: [
    ResetPasswordDialogueComponent,
  ]
})
export class AuthModule { }
