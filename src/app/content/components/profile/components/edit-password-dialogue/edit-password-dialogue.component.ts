import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreActions } from 'src/app/root-store';
import { pwMustMatchValidator, pwMustNotMatchValidator } from 'src/app/core/validators/pw-match-validator.directive';
import { PASSWORD_FORM_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import { AdminUser } from 'shared-models/user/admin-user.model';

@Component({
  selector: 'app-edit-password-dialogue',
  templateUrl: './edit-password-dialogue.component.html',
  styleUrls: ['./edit-password-dialogue.component.scss']
})
export class EditPasswordDialogueComponent implements OnInit {

  passwordForm: FormGroup;
  passwordFormValidationMessages = PASSWORD_FORM_VALIDATION_MESSAGES;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditPasswordDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private adminUser: AdminUser,
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      updatedPwGroup: this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', Validators.required]
      }, {validator: pwMustMatchValidator()})
    }, {validator: pwMustNotMatchValidator()});

    this.passwordForm.patchValue({
      email: this.adminUser.email
    });
  }

  onSave() {

    const oldPassword: string = this.oldPassword.value;
    const newPassword: string = this.newPassword.value;

    this.store$.dispatch( new AuthStoreActions.UpdatePasswordRequested({
      user: this.adminUser,
      oldPassword,
      newPassword
    }));

    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close(false);
  }

  // These getters are used for easy access in the HTML template
  get oldPassword() { return this.passwordForm.get('oldPassword'); }
  get updatedPwGroup() { return this.passwordForm.get('updatedPwGroup'); }
  get newPassword() { return this.passwordForm.get('updatedPwGroup.newPassword'); }
  get confirmNewPassword() { return this.passwordForm.get('updatedPwGroup.confirmNewPassword'); }

}
