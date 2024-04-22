import { Component, OnInit, inject, signal } from '@angular/core';
import { GlobalFieldValues } from '../../../../../shared-models/content/string-vals.model';
import { MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PublicUserExportRequestParams, PublicUserExportRequestParamsKeys } from '../../../../../shared-models/user/public-user-exports.model';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UiService } from '../../../core/services/ui.service';
import { DateTime } from 'luxon';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatLuxonDateModule, provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Observable, Subscription, catchError, filter, map, switchMap, take, tap, throwError, withLatestFrom } from 'rxjs';
import { ProcessingSpinnerComponent } from '../../../shared/components/processing-spinner/processing-spinner.component';
import { UserStoreActions, UserStoreSelectors } from '../../../root-store';

@Component({
  selector: 'app-export-config-dialogue',
  standalone: true,
  imports: [MatDialogClose, MatDialogModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatLuxonDateModule, MatButtonModule, ReactiveFormsModule, AsyncPipe, ProcessingSpinnerComponent, DatePipe, MatCheckboxModule],
  templateUrl: './export-config-dialogue.component.html',
  styleUrl: './export-config-dialogue.component.scss',
  providers: [
    provideLuxonDateAdapter(),
],
})
export class ExportConfigDialogueComponent implements OnInit {

  CANCEL = GlobalFieldValues.CANCEL;
  DOWNLOAD_REPORT = GlobalFieldValues.DOWNLOAD_REPORT;
  EXPORT_PUBLIC_USERS_TITLE = GlobalFieldValues.EXPORT_PUBLIC_USERS;
  EXPORT_BUTTON_VALUE = GlobalFieldValues.EXPORT;
  INCLUDE_OPT_OUTS_FIELD_VAULE = GlobalFieldValues.INCLUDE_OPT_OUTS;
  MAX_EXPORT_COUNT_FIELD_VALUE = GlobalFieldValues.MAX_EXPORT_COUNT;
  SELECT_DATE_RANGE_FIELD_VALUE = GlobalFieldValues.SELECT_DATE_RANGE;

  MIN_EXPORT_COUNT = 0;
  MAX_EXPORT_COUNT = 10000;

  readonly END_DATE_FORM_VALUE = 'endDate';
  readonly START_DATE_FORM_VALUE = 'startDate';

  private $exportSubscribersSubmitted = signal(false);
  private exportDownloadUrl$!: Observable<string | null>;
  private exportSubscribersError$!: Observable<{} | null>;
  exportSubscribersProcessing$!: Observable<boolean>;
  private exportSubscribersSubscription!: Subscription;

  $localExportDownloadUrl = signal(undefined as string | undefined);

  private dialogRef = inject(MatDialogRef<ExportConfigDialogueComponent>);
  private fb = inject(FormBuilder);
  private store$ = inject(Store);
  private uiService = inject(UiService);


  exportForm = this.fb.group({
    [this.START_DATE_FORM_VALUE]: [DateTime.now(), [Validators.required]],
    [this.END_DATE_FORM_VALUE]: [DateTime.now(), [Validators.required]],
    [PublicUserExportRequestParamsKeys.INCLUDE_OPT_OUTS]: [false, [Validators.required]],
    [PublicUserExportRequestParamsKeys.LIMIT]: [100, [Validators.required, Validators.min(this.MIN_EXPORT_COUNT), Validators.max(this.MAX_EXPORT_COUNT)]],
  });

  ngOnInit(): void {
    this.monitorProcesses();
  }

  private monitorProcesses() {
    this.exportDownloadUrl$ = this.store$.select(UserStoreSelectors.selectExportDownloadUrl);

    this.exportSubscribersError$ = this.store$.select(UserStoreSelectors.selectExportSubscribersError);
    this.exportSubscribersProcessing$ = this.store$.select(UserStoreSelectors.selectExportSubscribersProcessing);
  }


  get limitErrorMessage() {
    let errorMessage = '';
    if (this.limit.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    if (this.limit.hasError('min')) {
      return errorMessage = `Export count cannot be less than ${this.MIN_EXPORT_COUNT}`;
    }
    if (this.limit.hasError('max')) {
      return errorMessage = `Export count cannot be greater than ${this.MAX_EXPORT_COUNT}`;
    }
    return errorMessage;
  }

  onExportSubscribers() {          
    this.resetComponentState();

    const exportParams: PublicUserExportRequestParams = {
      [PublicUserExportRequestParamsKeys.END_DATE]: this.endDate.value.toMillis(),
      [PublicUserExportRequestParamsKeys.INCLUDE_OPT_OUTS]: this.includeOptOuts.value,
      [PublicUserExportRequestParamsKeys.LIMIT]: this.limit.value,
      [PublicUserExportRequestParamsKeys.START_DATE]: this.startDate.value.toMillis()
    }

    console.log('Exporting publicUsers with these exportRequestParams', exportParams);

    this.exportSubscribersSubscription = this.exportSubscribersError$
      .pipe(
        map(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe', processingError);
            this.resetComponentState();
          }
          return processingError;
        }),
        filter(processingError => !processingError ), // Halts function if processingError detected
        switchMap(processingError => {
          console.log('exportSubscribers triggered');
          if (!this.$exportSubscribersSubmitted()) {
            this.$exportSubscribersSubmitted.set(true);

            this.store$.dispatch(UserStoreActions.exportSubscribersRequested({exportParams}));
          }
          return this.exportDownloadUrl$;
        }),
        filter(downloadUrl => !!downloadUrl),
        tap(downloadUrl => {
          if (downloadUrl) {
            console.log('Export succeeded, setting localExportUrl', downloadUrl);
            this.$localExportDownloadUrl.set(downloadUrl);
          }
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetComponentState();
          return throwError(() => new Error(error));
        })
      ).subscribe();

  }

  private resetComponentState() {
    this.exportSubscribersSubscription?.unsubscribe();

    this.$exportSubscribersSubmitted.set(false);
    this.store$.dispatch(UserStoreActions.purgeUserStateErrors());
    this.store$.dispatch(UserStoreActions.purgeExportDownloadUrl());
  }

  ngOnDestroy(): void {
    this.exportSubscribersSubscription?.unsubscribe();

    this.exportSubscribersError$
      .pipe(
        take(1),
        withLatestFrom(this.exportDownloadUrl$),
        map(([error, downloadUrl]) => {
          if (error) {
            this.store$.dispatch(UserStoreActions.purgeUserStateErrors());
          }
          if (downloadUrl) {
            this.store$.dispatch(UserStoreActions.purgeExportDownloadUrl());
          }
        })
      )

  }

  get endDate() { return this.exportForm.get(this.END_DATE_FORM_VALUE) as FormControl<DateTime>; }
  get includeOptOuts() { return this.exportForm.get(PublicUserExportRequestParamsKeys.INCLUDE_OPT_OUTS) as FormControl<boolean>; }
  get limit() { return this.exportForm.get(PublicUserExportRequestParamsKeys.LIMIT) as FormControl<number>; }
  get startDate() { return this.exportForm.get(this.START_DATE_FORM_VALUE) as FormControl<DateTime>; }

}
