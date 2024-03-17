import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription, catchError, filter, map, switchMap, tap, throwError } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProcessingSpinnerComponent } from '../../../shared/components/processing-spinner/processing-spinner.component';
import { GlobalFieldValues } from '../../../../../shared-models/content/string-vals.model';
import { AdminUser, AdminUserKeys } from '../../../../../shared-models/user/admin-user.model';
import { UiService } from '../../../core/services/ui.service';
import { UserStoreActions, UserStoreSelectors } from '../../../root-store';
import { AdminUserUpdateData, UserUpdateType } from '../../../../../shared-models/user/user-update.model';

@Component({
    selector: 'app-edit-name-dialogue',
    templateUrl: './edit-name-dialogue.component.html',
    styleUrls: ['./edit-name-dialogue.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogClose, ProcessingSpinnerComponent, AsyncPipe]
})
export class EditNameDialogueComponent implements OnInit, OnDestroy {

  EDIT_NAME_TITLE_VALUE = GlobalFieldValues.EDIT_NAME;
  DISPLAY_NAME_FIELD_VALUE = GlobalFieldValues.DISPLAY_NAME;
  SAVE_BUTTON_VALUE = GlobalFieldValues.SAVE;
  CANCEL_BUTTON_VALUE = GlobalFieldValues.CANCEL;

  userUpdateProcessing$!: Observable<boolean>;
  private userUpdateError$!: Observable<{} | null>;
  private userUpdateSubscription!: Subscription;
  private $updateUserSubmitted = signal(false);
  private $updateUserCycleInit = signal(false);
  private $updateUserCycleComplete = signal(false);
  
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditNameDialogueComponent>);
  private store$ = inject(Store);
  private userData: AdminUser = inject(MAT_DIALOG_DATA);
  private uiService = inject(UiService);

  nameForm = this.fb.group({
    [AdminUserKeys.DISPLAY_NAME]: ['']
  });

  constructor() { }

  ngOnInit() {
    this.initForm();
    this.monitorUpdateRequests();
  }

  private initForm(): void {
    // Patch in existing data if it exists
    this.nameForm.patchValue({
      [AdminUserKeys.DISPLAY_NAME]: this.userData.displayName,
    });
  }

  private monitorUpdateRequests(): void {
    this.userUpdateProcessing$ = this.store$.select(UserStoreSelectors.selectUpdateAdminUserProcessing);
    this.userUpdateError$ = this.store$.select(UserStoreSelectors.selectUpdateAdminUserError);
  }

  onSubmit() {

    this.userUpdateSubscription = this.userUpdateError$ 
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
          if (!this.$updateUserSubmitted()) {
            this.$updateUserSubmitted.set(true);
            const userData: Partial<AdminUser> = {
              id: this.userData.id,
              displayName: this.displayName.value
            };
        
            const userUpdateData: AdminUserUpdateData = {
              userData,
              updateType: UserUpdateType.BIO_UPDATE
            };
        
            this.store$.dispatch(UserStoreActions.updateAdminUserRequested({userUpdateData}));
          }
          return this.userUpdateProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(updateProcessing => {
          if (updateProcessing) {
            this.$updateUserCycleInit.set(true);
          }
          if (!updateProcessing && this.$updateUserCycleInit()) {
            console.log('updateUser successful, proceeding with pipe.');
            this.$updateUserCycleInit.set(false);
            this.$updateUserCycleComplete.set(true);
          }
        }),
        filter(updateProcessing => !updateProcessing && this.$updateUserCycleComplete()),
        tap(updateProcessing => {
          this.uiService.showSnackBar(`User details updated!`, 10000);
          this.resetComponentState();
          this.dialogRef.close(true);
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 10000);
          this.resetComponentState();
          this.dialogRef.close(false);
          return throwError(() => new Error(error));
        })
      ).subscribe()
  }

  private resetComponentState() {
    this.userUpdateSubscription?.unsubscribe();
    this.$updateUserSubmitted.set(false);
    this.$updateUserCycleInit.set(false);
    this.$updateUserCycleComplete.set(false);
    this.store$.dispatch(UserStoreActions.purgeUserStateErrors());
  }

  // These getters are used for easy access in the HTML template
  get displayName() { return this.nameForm.get(AdminUserKeys.DISPLAY_NAME) as FormControl; }

  ngOnDestroy(): void {
    this.userUpdateSubscription?.unsubscribe();
  }

}
