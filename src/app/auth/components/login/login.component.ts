import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors, UserStoreSelectors, AuthStoreActions } from 'src/app/root-store';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { loginValidationMessages } from 'src/app/core/models/validation-messages.model';
import { Observable } from 'rxjs';
import { AuthData } from 'src/app/core/models/auth-data.model';
import { AuthenticateUserType } from 'src/app/core/models/authenticate-user-type.model';
import { ResetPasswordDialogueComponent } from '../reset-password-dialogue/reset-password-dialogue.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  LOGIN_FORM_VALIDATION_MESSAGES = loginValidationMessages;
  loginForm: FormGroup;
  userAuth$: Observable<boolean>;
  userLoaded$: Observable<boolean>;

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onEmailLogin() {
    const userAuthData: AuthData = {
      email: this.email.value,
      password: this.password.value
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

    dialogConfig.data = this.email.value;

    const dialogRef = this.dialog.open(ResetPasswordDialogueComponent, dialogConfig);
  }

  // Getters for easy access to form fields
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

}
