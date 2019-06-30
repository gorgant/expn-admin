import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from '../components/profile/profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditEmailDialogueComponent } from '../components/edit-email-dialogue/edit-email-dialogue.component';
import { EditNameDialogueComponent } from '../components/edit-name-dialogue/edit-name-dialogue.component';
import { EditPasswordDialogueComponent } from '../components/edit-password-dialogue/edit-password-dialogue.component';

@NgModule({
  declarations: [
    ProfileComponent,
    EditNameDialogueComponent,
    EditEmailDialogueComponent,
    EditPasswordDialogueComponent,
  ],
  imports: [
    SharedModule,
    ProfileRoutingModule
  ],
  entryComponents: [
    EditNameDialogueComponent,
    EditEmailDialogueComponent,
    EditPasswordDialogueComponent
  ]
})
export class ProfileModule { }
