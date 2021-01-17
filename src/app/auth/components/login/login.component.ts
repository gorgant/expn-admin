import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors, UserStoreSelectors, AuthStoreActions } from 'src/app/root-store';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ResetPasswordDialogueComponent } from '../reset-password-dialogue/reset-password-dialogue.component';
import { LOGIN_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import { AuthData, AuthKeys } from 'shared-models/auth/auth-data.model';
import { AuthenticateUserType } from 'shared-models/auth/authenticate-user-type.model';
import { ShorthandBusinessNames } from 'shared-models/forms-and-components/legal-vars.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginValidationMessages = LOGIN_VALIDATION_MESSAGES;
  loginForm: FormGroup;
  userAuth$: Observable<boolean>;
  userLoaded$: Observable<boolean>;
  shorthandBusinessName = ShorthandBusinessNames.EXPN;

  constructor(
    private fb: FormBuilder,
    private store$: Store<RootStoreState.State>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    // These power the user-loading-spinner
    this.userAuth$ = this.store$.select(AuthStoreSelectors.selectIsAuth);
    this.userLoaded$ = this.store$.select(UserStoreSelectors.selectUserLoaded);

    this.loginForm = this.fb.group({
      [AuthKeys.EMAIL]: ['', [Validators.required, Validators.email]],
      [AuthKeys.PASSWORD]: ['', Validators.required],
    });
  }

  onEmailLogin() {
    const userAuthData: AuthData = {
      [AuthKeys.EMAIL]: this[AuthKeys.EMAIL].value,
      [AuthKeys.PASSWORD]: this[AuthKeys.PASSWORD].value
    };
    this.store$.dispatch(new AuthStoreActions.AuthenticationRequested(
      {authData: userAuthData, requestType: AuthenticateUserType.EMAIL_AUTH}
    ));
  }

  onResetPassword() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '300px';

    dialogConfig.data = this[AuthKeys.EMAIL].value;

    const dialogRef = this.dialog.open(ResetPasswordDialogueComponent, dialogConfig);
  }

  // Getters for easy access to form fields
  get [AuthKeys.EMAIL]() { return this.loginForm.get(AuthKeys.EMAIL); }
  get [AuthKeys.PASSWORD]() { return this.loginForm.get(AuthKeys.PASSWORD); }

}
