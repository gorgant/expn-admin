import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ResetPasswordDialogueComponent } from '../reset-password-dialogue/reset-password-dialogue.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import { GlobalFieldValues } from '../../../../shared-models/content/string-vals.model';
import { AuthFormData, AuthResultsData } from '../../../../shared-models/auth/auth-data.model';
import { AdminUser, AdminUserKeys } from '../../../../shared-models/user/admin-user.model';
import { UiService } from '../../core/services/ui.service';
import { UserRegistrationFormFieldKeys } from '../../../../shared-models/forms/user-registration-form-vals.model';
import { AuthStoreActions, AuthStoreSelectors, UserStoreActions, UserStoreSelectors } from '../../root-store';
import { AdminUserUpdateData, UserUpdateType } from '../../../../shared-models/user/user-update.model';
import { AdminAppRoutes } from '../../../../shared-models/routes-and-paths/app-routes.model';
import { DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP, DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE } from '../../../../shared-models/user-interface/dialogue-box-default-config.model';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, NgClass, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class LoginFormComponent implements OnInit, OnDestroy {

  EMAIL_FIELD_VALUE = GlobalFieldValues.EMAIL;
  PASSWORD_FIELD_VALUE = GlobalFieldValues.PASSWORD;
  FORGOT_PASSWORD_BLURB = GlobalFieldValues.FORGOT_PASSWORD;
  CHECK_INBOX_BLURB = GlobalFieldValues.CHECK_INBOX;
  LOG_IN_BUTTON_VALUE = GlobalFieldValues.LOGIN;

  private authData$!: Observable<AuthResultsData | null>;
  private userData$!: Observable<AdminUser | null>;

  private $emailAuthRequested = signal(false);
  private emailAuthError$!: Observable<{} | null>;
  private emailAuthProcessing$!: Observable<boolean>;
  private emailAuthSubscription!: Subscription;
  
  private $updateUserSubmitted = signal(false);
  private $updateUserCycleInit = signal(false);
  private $updateUserCycleComplete = signal(false);
  private updateUserError$!: Observable<{} | null>;
  private updateUserProcessing$!: Observable<boolean>;

  combinedAuthenticateUserError$!: Observable<any>;
  
  $showResetMessage = signal(false);

  private store$ = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private uiService = inject(UiService);

  authForm = this.fb.group({
    [AdminUserKeys.EMAIL]: ['', [Validators.required, Validators.email]],
    [UserRegistrationFormFieldKeys.PASSWORD]: ['', [Validators.required]],
  });
  

  constructor() { }

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    this.authData$ = this.store$.select(AuthStoreSelectors.selectAuthResultsData);
    this.userData$ = this.store$.select(UserStoreSelectors.selectAdminUserData);

    this.emailAuthError$ = this.store$.select(AuthStoreSelectors.selectEmailAuthError);
    this.emailAuthProcessing$ = this.store$.select(AuthStoreSelectors.selectEmailAuthProcessing);

    this.updateUserError$ = this.store$.select(UserStoreSelectors.selectUpdateAdminUserError);
    this.updateUserProcessing$ = this.store$.select(UserStoreSelectors.selectUpdateAdminUserProcessing);

    this.combinedAuthenticateUserError$ = combineLatest(
      [
        this.emailAuthError$,
        this.updateUserError$
      ]
    ).pipe(
        map(([authError, updateError]) => {
          if (authError || updateError) {
            return authError || updateError;
          }
          return null;
        })
    );
    
  }

  get emailErrorMessage() {
    let errorMessage = '';
    if (this.email.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    if (this.email.hasError('email')) {
      return errorMessage =  'Not a valid email.';
    }
    return errorMessage;
  }

  get passwordErrorMessage() {
    let errorMessage = '';
    if (this.password.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    return errorMessage;
  }

  // 1) Fetch authData 2) use authData to create or update user, 3) ensure user is verified in db and in auth, 4) route user to requested page
  onSubmit(): void {

    if (!this.email.dirty || !this.password.dirty) {
      this.uiService.showSnackBar(`You must provide your login details to proceed!`, 10000);
      return;
    }

    this.emailAuthSubscription = this.combinedAuthenticateUserError$
      .pipe(
        map(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe', processingError);
            this.resetComponentState();
            this.store$.dispatch(AuthStoreActions.logout());
          }
          return processingError;
        }),
        filter(processingError => !processingError), // Halts function if processingError detected
        switchMap(processingError => {
          if (!this.$emailAuthRequested()) {
            this.$emailAuthRequested.set(true);
            const authFormData: AuthFormData = {
              email: this.email.value,
              password: this.password.value
            }
            this.store$.dispatch(AuthStoreActions.emailAuthRequested({authData: authFormData}));
          }
          return this.emailAuthProcessing$;
        }),
        withLatestFrom(this.authData$),
        filter(([authProcessing, authData]) => !!authData), // Only proceed once authData is available
        switchMap(([authProcessing, authData]) => {
          console.log('User authenticated', authData);
          if (!this.$updateUserSubmitted()) {
            this.$updateUserSubmitted.set(true);
            const userData: Partial<AdminUser> = {
              id: authData?.id,
              email: authData?.email
            }
            const userUpdateData: AdminUserUpdateData = {
              userData,
              updateType: UserUpdateType.AUTHENTICATION
            }
            this.store$.dispatch(UserStoreActions.updateAdminUserRequested({userUpdateData}));
          }
          return this.updateUserProcessing$;
        }),
        withLatestFrom(this.userData$),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(([updateProcessing, userData]) => {
          if (updateProcessing) {
            this.$updateUserCycleInit.set(true);
          }
          if (!updateProcessing && this.$updateUserCycleInit()) {
            console.log('updateUser successful, proceeding with pipe.');
            this.$updateUserCycleComplete.set(true);
            this.$updateUserCycleInit.set(false);
          }
        }),
        filter(([updateProcessing, userData]) => !updateProcessing && this.$updateUserCycleComplete() && !!userData),
        tap(([updateProcessing, userData]: [boolean, AdminUser]) => {
          console.log('User authenticated and updated, routing user to requested route.');
          this.redirectUserToRequestedRoute();
        }),
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetComponentState();
          this.store$.dispatch(AuthStoreActions.logout());
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }

  // After the login flow is complete, redirect user to the requested route or otherwise to Workouts
  private redirectUserToRequestedRoute(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    if (returnUrl && returnUrl !== '/') {
      console.log('returnURL is not root, navigating to:', returnUrl);
      this.router.navigate([returnUrl]);
    } else {
      console.log(`returnUrl is root, navigating to ${[AdminAppRoutes.HOME]}`);
      this.router.navigate([AdminAppRoutes.HOME]);
    }
  }

  onResetPassword() {
    let dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE};
    if (!this.uiService.$screenIsMobile()) {
      dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP};
    }
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.email.value;
    console.log('Reset password requested with this config', dialogConfig);

    const dialogRef = this.dialog.open(ResetPasswordDialogueComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(submitted => {
      if (submitted) {
        this.$showResetMessage.set(true);
      }
    })

  }

  // Makes login screen visible again after completing a password reset
  onRestoreLoginScreen() {
    this.$showResetMessage.set(false);
  }

  private resetComponentState() {
    this.emailAuthSubscription?.unsubscribe();
    this.$emailAuthRequested.set(false);
    
    this.$updateUserSubmitted.set(false);
    this.$updateUserCycleInit.set(false);
    this.$updateUserCycleComplete.set(false);

    this.$showResetMessage.set(false);

    this.store$.dispatch(AuthStoreActions.purgeAuthStateErrors());
    this.store$.dispatch(UserStoreActions.purgeUserStateErrors());
  }

  ngOnDestroy() {
    this.emailAuthSubscription?.unsubscribe();
  }

  // These getters are used for easy access in the HTML template
  get email() { return this.authForm.get(AdminUserKeys.EMAIL) as FormControl<string>; }
  get password() { return this.authForm.get(UserRegistrationFormFieldKeys.PASSWORD) as FormControl<string>; }

}
