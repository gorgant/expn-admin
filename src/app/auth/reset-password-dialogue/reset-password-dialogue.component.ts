import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProcessingSpinnerComponent } from '../../shared/components/processing-spinner/processing-spinner.component';
import { GlobalFieldValues } from '../../../../shared-models/content/string-vals.model';
import { UiService } from '../../core/services/ui.service';
import { AuthStoreActions, AuthStoreSelectors } from '../../root-store';

@Component({
    selector: 'app-reset-password-dialogue',
    templateUrl: './reset-password-dialogue.component.html',
    styleUrls: ['./reset-password-dialogue.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogClose, ProcessingSpinnerComponent, AsyncPipe]
})
export class ResetPasswordDialogueComponent implements OnInit {

  CANCEL_BUTTON_VALUE = GlobalFieldValues.CANCEL;
  EMAIL_FIELD_TITLE = GlobalFieldValues.EMAIL;
  RESET_PASSWORD_TITLE = GlobalFieldValues.RESET_PASSWORD;
  SUBMIT_BUTTON_VALUE = GlobalFieldValues.SUBMIT;

  private $resetPasswordSubmitted = signal(false);
  private $resetPasswordCycleInit = signal(false);
  private $resetPasswordCycleComplete = signal(false);
  private resetPasswordError$!: Observable<{} | null>;
  resetPasswordProcessing$!: Observable<boolean>;
  private resetPasswordSubscription!: Subscription;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ResetPasswordDialogueComponent>);
  private emailString: string = inject(MAT_DIALOG_DATA);
  private store$ = inject(Store);
  private uiService = inject(UiService);

  resetPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });


  constructor() { }

  ngOnInit() {
    this.initForm();
    this.monitorResetRequests();
  }

  initForm() {
    if (this.emailString) {
      this.resetPasswordForm.patchValue({
        email: this.emailString
      });
    }
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

  monitorResetRequests() {
    this.resetPasswordProcessing$ = this.store$.select(AuthStoreSelectors.selectResetPasswordProcessing);
    this.resetPasswordError$ = this.store$.select(AuthStoreSelectors.selectResetPasswordError);
  }

  onSubmit() {
    const email = this.email.value;
    this.resetPasswordSubscription = this.resetPasswordError$
      .pipe(
        map(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating dialog', processingError);
            this.resetComponentState();
            this.dialogRef.close(false);
          }
          return processingError;
        }),
        filter(processingError => !processingError ), // Halts function if processingError detected
        switchMap(processingError => {
          if (!this.$resetPasswordSubmitted()) {
            this.$resetPasswordSubmitted.set(true);
            this.store$.dispatch(AuthStoreActions.resetPasswordRequested({email}));
          }
          return this.resetPasswordProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(resetProcessing => {
          if (resetProcessing) {
            this.$resetPasswordCycleInit.set(true);
          }
          if (!resetProcessing && this.$resetPasswordCycleInit()) {
            console.log('resetPassword successful, proceeding with pipe.');
            this.$resetPasswordCycleInit.set(false);
            this.$resetPasswordCycleComplete.set(true);
          }
        }),
        filter(resetProcessing => !resetProcessing && this.$resetPasswordCycleComplete()),
        tap(resetProcessing => {
          this.dialogRef.close(true);
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetComponentState();
          this.dialogRef.close(false);
          return throwError(() => new Error(error));
        })
      )
      .subscribe();
  }

  private resetComponentState() {
    this.resetPasswordSubscription?.unsubscribe();
    this.$resetPasswordSubmitted.set(false);
    this.$resetPasswordCycleInit.set(false);
    this.$resetPasswordCycleComplete.set(false);
    this.store$.dispatch(AuthStoreActions.purgeAuthStateErrors());
  }

  // These getters are used for easy access in the HTML template
  get email() { return this.resetPasswordForm.get('email') as FormControl<string>; }

  ngOnDestroy(): void {
    this.resetPasswordSubscription?.unsubscribe();
    
  }

}
