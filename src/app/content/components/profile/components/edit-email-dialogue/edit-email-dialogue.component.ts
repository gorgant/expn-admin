import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreActions } from 'src/app/root-store';
import { EMAIL_FORM_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import { AdminUser } from 'shared-models/user/admin-user.model';
import { AuthKeys } from 'shared-models/auth/auth-data.model';

@Component({
  selector: 'app-edit-email-dialogue',
  templateUrl: './edit-email-dialogue.component.html',
  styleUrls: ['./edit-email-dialogue.component.scss']
})
export class EditEmailDialogueComponent implements OnInit {

  emailForm: FormGroup;
  emailFormValidationMessages = EMAIL_FORM_VALIDATION_MESSAGES;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditEmailDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private adminUser: AdminUser,
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.emailForm = this.fb.group({
      [AuthKeys.EMAIL]: ['', [Validators.required, Validators.email]],
      [AuthKeys.PASSWORD]: ['', Validators.required],
    });

    this.emailForm.patchValue({
      [AuthKeys.EMAIL]: this.adminUser.email
    });
  }

  onSave() {

    const password: string = this[AuthKeys.PASSWORD].value;
    const newEmail: string = this[AuthKeys.EMAIL].value;

    this.store$.dispatch( new AuthStoreActions.UpdateEmailRequested({
      user: this.adminUser,
      password,
      newEmail
    }));

    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close(false);
  }

  // These getters are used for easy access in the HTML template
  get [AuthKeys.EMAIL]() { return this.emailForm.get(AuthKeys.EMAIL); }
  get [AuthKeys.PASSWORD]() { return this.emailForm.get(AuthKeys.PASSWORD); }

}
