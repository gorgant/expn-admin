import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreActions } from 'src/app/root-store';
import { RESET_PASSWORD_FROM_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import { AuthKeys } from 'shared-models/auth/auth-data.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password-dialogue.component.html',
  styleUrls: ['./reset-password-dialogue.component.scss']
})
export class ResetPasswordDialogueComponent implements OnInit {

  resetPasswordForm: FormGroup;
  resetPasswordFormValidationMessage = RESET_PASSWORD_FROM_VALIDATION_MESSAGES;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ResetPasswordDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private emailFromSignIn: string,
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      [AuthKeys.EMAIL]: ['', [Validators.required, Validators.email]]
    });

    if (this.emailFromSignIn) {
      this.resetPasswordForm.patchValue({
        [AuthKeys.EMAIL]: this.emailFromSignIn
      });
    }
  }

  onSubmit() {
    this.store$.dispatch(new AuthStoreActions.ResetPasswordRequested({email: this.email.value}));
    this.dialogRef.close();
  }

  // These getters are used for easy access in the HTML template
  get [AuthKeys.EMAIL]() { return this.resetPasswordForm.get(AuthKeys.EMAIL); }

}

