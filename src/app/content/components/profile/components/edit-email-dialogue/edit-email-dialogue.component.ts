import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreActions } from 'src/app/root-store';
import { EMAIL_FORM_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import { AdminUser } from 'shared-models/user/admin-user.model';

@Component({
  selector: 'app-edit-email-dialogue',
  templateUrl: './edit-email-dialogue.component.html',
  styleUrls: ['./edit-email-dialogue.component.scss']
})
export class EditEmailDialogueComponent implements OnInit {

  emailForm: FormGroup;
  EMAIL_FORM_VALIDATION_MESSAGES = EMAIL_FORM_VALIDATION_MESSAGES;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditEmailDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private adminUser: AdminUser,
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.emailForm.patchValue({
      email: this.adminUser.email
    });
  }

  onSave() {

    const password: string = this.password.value;
    const newEmail: string = this.email.value;

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
  get password() { return this.emailForm.get('password'); }
  get email() { return this.emailForm.get('email'); }

}
