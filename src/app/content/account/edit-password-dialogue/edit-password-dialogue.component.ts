import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, catchError, filter, map, switchMap, tap, throwError, withLatestFrom } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ProcessingSpinnerComponent } from '../../../shared/components/processing-spinner/processing-spinner.component';
import { GlobalFieldValues } from '../../../../../shared-models/content/string-vals.model';
import { AdminUser } from '../../../../../shared-models/user/admin-user.model';
import { UiService } from '../../../core/services/ui.service';
import { AuthStoreActions, AuthStoreSelectors, UserStoreSelectors } from '../../../root-store';

@Component({
    selector: 'app-edit-password-dialogue',
    templateUrl: './edit-password-dialogue.component.html',
    styleUrls: ['./edit-password-dialogue.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatDialogClose, ProcessingSpinnerComponent, AsyncPipe]
})
export class EditPasswordDialogueComponent implements OnInit, OnDestroy {

  CHANGE_PASSWORD_TITLE_VALUE = GlobalFieldValues.CHANGE_PASSWORD;
  CHANGE_PASSWORD_BLURB = GlobalFieldValues.CHANGE_PASSWORD_BLURB;
  SUBMIT_BUTTON_VALUE = GlobalFieldValues.SUBMIT;
  CANCEL_BUTTON_VALUE = GlobalFieldValues.CANCEL;

  resetPasswordProcessing$!: Observable<boolean>;
  private resetPasswordSubmitted = signal(false);
  private resetPasswordError$!: Observable<{} | null>;
  private resetPasswordSubscription!: Subscription;
  private $resetPasswordCycleInit = signal(false);
  private $resetPasswordCycleComplete = signal(false);

  userData$!: Observable<AdminUser>;

  private dialogRef = inject(MatDialogRef<EditPasswordDialogueComponent>);
  private store$ = inject(Store);
  private uiService = inject(UiService);

  constructor() { }

  ngOnInit(): void {
    this.monitorResetRequests();
  }

  monitorResetRequests() {
    this.userData$ = this.store$.select(UserStoreSelectors.selectAdminUserData) as Observable<AdminUser>;
    this.resetPasswordProcessing$ = this.store$.select(AuthStoreSelectors.selectResetPasswordProcessing);
    this.resetPasswordError$ = this.store$.select(AuthStoreSelectors.selectResetPasswordError);
  }

  onSubmit() {

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
        withLatestFrom(this.userData$),
        filter(([processingError, userData]) => !processingError ), // Halts function if processingError detected
        switchMap(([processingError, userData]) => {
          const email = userData.email;
          this.store$.dispatch(AuthStoreActions.resetPasswordRequested({email}));
          this.resetPasswordSubmitted.set(true);
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
        filter(updateProcessing => !updateProcessing && this.$resetPasswordCycleComplete()),
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
    this.resetPasswordSubmitted.set(false);
    this.$resetPasswordCycleInit.set(false);
    this.$resetPasswordCycleComplete.set(false);
    this.store$.dispatch(AuthStoreActions.purgeAuthStateErrors());
  }

  ngOnDestroy(): void {
    this.resetPasswordSubscription?.unsubscribe();
  }

}
