import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, take, tap } from 'rxjs';
import { GlobalFieldValues } from '../../../../shared-models/content/string-vals.model';
import { DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP, DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE } from '../../../../shared-models/user-interface/dialogue-box-default-config.model';
import { AdminUser } from '../../../../shared-models/user/admin-user.model';
import { UserStoreSelectors, AuthStoreActions } from '../../root-store';
import { EditNameDialogueComponent } from './edit-name-dialogue/edit-name-dialogue.component';
import { EditPasswordDialogueComponent } from './edit-password-dialogue/edit-password-dialogue.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { UiService } from '../../core/services/ui.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, AsyncPipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  EDIT_BUTTON_VALUE = GlobalFieldValues.EDIT;
  CHANGE_PASSWORD_BUTTON_VALUE = GlobalFieldValues.CHANGE_PASSWORD;
  LOGOUT_BUTTON_VALUE = GlobalFieldValues.LOGOUT;

  userData$!: Observable<AdminUser>;

  private store$ = inject(Store);
  private dialog = inject(MatDialog);
  private uiService = inject(UiService);

  constructor() { }

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.userData$ = this.store$.select(UserStoreSelectors.selectAdminUserData) as Observable<AdminUser>;
  }

  onEditName() {
    this.userData$
      .pipe(
        take(1),
        tap(user => {
          let dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE};
          if (!this.uiService.$screenIsMobile()) {
            dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP};
          }
          dialogConfig.data = user;
          const dialogRef = this.dialog.open(EditNameDialogueComponent, dialogConfig);  
        })
      ).subscribe();
  }

  onEditPassword() {
    let dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE};
    if (!this.uiService.$screenIsMobile()) {
      dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP};
    }
    const dialogRef = this.dialog.open(EditPasswordDialogueComponent, dialogConfig);
  }

  onLogout(): void {
    console.log('Logging out user');
    this.store$.dispatch(AuthStoreActions.logout());
  }
}
