import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // For ngModel
import { MatLuxonDateModule, provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { GlobalFieldValues } from '../../../../../../shared-models/content/string-vals.model';
import { BlogIndexRef, Post, PostKeys } from '../../../../../../shared-models/posts/post.model';
import { Observable, Subscription, catchError, combineLatest, filter, map, switchMap, tap, throwError, withLatestFrom } from 'rxjs';
import { AdminUser, AdminUserKeys } from '../../../../../../shared-models/user/admin-user.model';
import { Store } from '@ngrx/store';
import { PostStoreActions, PostStoreSelectors, UserStoreSelectors } from '../../../../root-store';
import { UiService } from '../../../../core/services/ui.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ProcessingSpinnerComponent } from "../../../../shared/components/processing-spinner/processing-spinner.component";

@Component({
    selector: 'app-schedule-post-dialogue',
    standalone: true,
    templateUrl: './schedule-post-dialogue.component.html',
    styleUrl: './schedule-post-dialogue.component.scss',
    providers: [
        provideLuxonDateAdapter(),
    ],
    imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatLuxonDateModule, MatButtonModule, ReactiveFormsModule, AsyncPipe, ProcessingSpinnerComponent, DatePipe]
})
export class SchedulePostDialogueComponent implements OnInit, OnDestroy {

  CANCEL_BUTTON_VALUE = GlobalFieldValues.CANCEL;
  CONFIRM_BUTTON_VALUE = GlobalFieldValues.CONFIRM;
  UNSCHEDULE_BUTTON_VALUE = GlobalFieldValues.UNSCHEDULE;
  HOUR_FIELD_VALUE = GlobalFieldValues.HOUR;
  MINUTES_FIELD_VALUE = GlobalFieldValues.MINS;
  SCHEDULE_POST_TITLE = GlobalFieldValues.SCHEDULE_POST;
  SCHEDULE_POST_BLURB = GlobalFieldValues.SCHEDULE_POST_BLURB;
  SELECT_DATE_FIELD_VALUE = GlobalFieldValues.SELECT_DATE;

  SCHEDULED_HOURS_MIN = 0;
  SCHEDULED_HOURS_MAX = 23;
  SCHEDULED_MINUTES_MIN = 0;
  SCHEDULED_MINUTES_MAX = 59;

  private readonly SCHEDULED_DATE_FORM_VALUE = 'scheduledDate';
  private readonly SCHEDULED_HOURS_FORM_VALUE = 'scheduledHours';
  private readonly SCHEDULED_MINUTES_FORM_VALUE = 'scheduledMinutes';

  private userData$!: Observable<AdminUser>;
  
  private fetchAndUpdatePostSubscription!: Subscription;
  
  private $fetchSinglePostSubmitted = signal(false);
  private fetchSinglePostError$!: Observable<{} | null>;
  private fetchSinglePostProcessing$!: Observable<boolean>;

  private $updatePostCycleComplete = signal(false);
  private $updatePostCycleInit = signal(false);
  private $updatePostSubmitted = signal(false);
  updatePostProcessing$!: Observable<boolean>;
  private updatePostError$!: Observable<{} | null>;

  private combinedFetchAndUpdatePostError$!: Observable<{} | null>;
  combinedFetchAndUpdatePostProcessing$!: Observable<boolean>;

  private dialogRef = inject(MatDialogRef<SchedulePostDialogueComponent>);
  private fb = inject(FormBuilder);
  blogIndexRef = inject<BlogIndexRef>(MAT_DIALOG_DATA);
  private store$ = inject(Store);
  private uiService = inject(UiService);

  scheduleForm = this.fb.group({
    [this.SCHEDULED_DATE_FORM_VALUE]: [DateTime.now(), [Validators.required]],
    [this.SCHEDULED_HOURS_FORM_VALUE]: [0, [Validators.required, Validators.min(this.SCHEDULED_HOURS_MIN), Validators.max(this.SCHEDULED_HOURS_MAX)]],
    [this.SCHEDULED_MINUTES_FORM_VALUE]: [0, [Validators.required, Validators.min(this.SCHEDULED_MINUTES_MIN), Validators.max(this.SCHEDULED_MINUTES_MAX)]]
  });

  ngOnInit(): void {
    this.monitorProcesses();
    this.initializeFormWithExistingDateTimeData();
  }

  private monitorProcesses() {

    this.fetchSinglePostError$ = this.store$.select(PostStoreSelectors.selectFetchSinglePostError);
    this.fetchSinglePostProcessing$ = this.store$.select(PostStoreSelectors.selectFetchSinglePostProcessing);
    
    this.updatePostError$ = this.store$.select(PostStoreSelectors.selectUpdatePostError);
    this.updatePostProcessing$ = this.store$.select(PostStoreSelectors.selectUpdatePostProcessing);

    this.userData$ = this.store$.select(UserStoreSelectors.selectAdminUserData) as Observable<AdminUser>;

    this.combinedFetchAndUpdatePostError$ = combineLatest(
      [
        this.fetchSinglePostError$,
        this.updatePostError$
      ]
    ).pipe(
        map(([fetchError, updateError]) => {
          if (fetchError || updateError) {
            return fetchError || updateError;
          }
          return null;
        })
    );

    this.combinedFetchAndUpdatePostProcessing$ = combineLatest(
      [
        this.fetchSinglePostProcessing$,
        this.updatePostProcessing$
      ]
    ).pipe(
        map(([fetchProcessing, updateProcessing]) => {
          if (fetchProcessing || updateProcessing) {
            return fetchProcessing || updateProcessing;
          }
          return false;
        })
    );

  }

  get scheduledDateErrorMessage() {
    let errorMessage = '';
    if (this.scheduledDate.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    return errorMessage;
  }

  get scheduledHoursErrorMessage() {
    let errorMessage = '';
    if (this.scheduledHours.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    if (this.scheduledHours.hasError('min')) {
      return errorMessage = `Hours cannot be less than ${this.SCHEDULED_HOURS_MIN}`;
    }
    if (this.scheduledHours.hasError('max')) {
      return errorMessage = `Hours cannot be greater than ${this.SCHEDULED_HOURS_MAX}`;
    }
    return errorMessage;
  }

  get scheduledMinutesErrorMessage() {
    let errorMessage = '';
    if (this.scheduledMinutes.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    if (this.scheduledMinutes.hasError('min')) {
      return errorMessage = `Minutes cannot be less than ${this.SCHEDULED_MINUTES_MIN}`;
    }
    if (this.scheduledMinutes.hasError('max')) {
      return errorMessage = `Minutes cannot be greater than ${this.SCHEDULED_MINUTES_MAX}`;
    }
    return errorMessage;
  }

  private initializeFormWithExistingDateTimeData(): void {
    const scheduledAutopublishTimestamp = this.blogIndexRef[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP];
    if (!scheduledAutopublishTimestamp) {
      console.log('No scheduledAutopublishTimestamp on blogIndexRef, will not patch data');
      return;
    }
    const dateTime = DateTime.fromMillis(scheduledAutopublishTimestamp as number);

    this.scheduledDate.setValue(dateTime);
    this.scheduledHours.setValue(dateTime.hour);
    this.scheduledMinutes.setValue(dateTime.minute);

    console.log('Patched blogIndexRef data into scheduleForm', this.scheduleForm.value);

  }

  onSchedulePost() {
    const scheduledDateTimeInMillis = this.combineDateTimeAndConvertToMillis();
    if (!scheduledDateTimeInMillis) {
      console.log('Error calculating scheduledDateTimeInMillis, terminating function');
      return;
    }
    this.fetchAndUpdatePost(scheduledDateTimeInMillis);
  }

  private combineDateTimeAndConvertToMillis(): number | null {
    if (this.scheduledDate.value && this.scheduledHours.value !== null && this.scheduledMinutes.value !== null) {
      const combinedDateTime = this.scheduledDate.value.set({
        hour: this.scheduledHours.value,
        minute: this.scheduledMinutes.value
      });
      return combinedDateTime.toMillis();
    }
    return null;
  }

  onUnschedulPost() {
    this.fetchAndUpdatePost(null);
  }

  private fetchAndUpdatePost(scheduledDateTimeInMillis: number | null) {
    const postId = this.blogIndexRef[PostKeys.ID];
    const singlePost$ = this.store$.select(PostStoreSelectors.selectPostById(postId));
    
    this.fetchAndUpdatePostSubscription = this.combinedFetchAndUpdatePostError$
      .pipe(
        switchMap(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe', processingError);
            this.resetFetchAndUpdatePostComponentState();
            this.dialogRef.close();
          }
          return singlePost$;
        }),
        withLatestFrom(this.fetchSinglePostError$),
        filter(([post, processingError]) => !processingError),
        map(([post, processingError]) => {
          if (!post && !this.$fetchSinglePostSubmitted()) {
            this.$fetchSinglePostSubmitted.set(true);
            console.log(`post ${postId} not in store, fetching from database`);
            this.store$.dispatch(PostStoreActions.fetchSinglePostRequested({postId}));
          }
          return post;
        }),
        filter(post => !!post),
        withLatestFrom(this.userData$),
        switchMap(([post, userData]) => {
          if (!this.$updatePostSubmitted()) {
            this.$updatePostSubmitted.set(true);

            const postUpdates = {
              ...post as Post,
              [PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP]: scheduledDateTimeInMillis,
              [PostKeys.LAST_MODIFIED_USER_ID]: userData[AdminUserKeys.ID],
              [PostKeys.LAST_MODIFIED_USER_NAME]: userData[AdminUserKeys.DISPLAY_NAME] || userData[AdminUserKeys.EMAIL],
            };
            
            this.store$.dispatch(PostStoreActions.updatePostRequested({postUpdates}));
          }
          return this.updatePostProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(updateProcessing => {
          if (updateProcessing) {
            this.$updatePostCycleInit.set(true);
          }
          if (!updateProcessing && this.$updatePostCycleInit()) {
            console.log('updatePost successful, proceeding with pipe.');
            this.$updatePostCycleInit.set(false);
            this.$updatePostCycleComplete.set(true);
          }
        }),
        filter(updateProcessing => !updateProcessing && this.$updatePostCycleComplete()),
        tap(updateProcessing => {
          this.uiService.showSnackBar(`Post scheduled!`, 5000);
          this.dialogRef.close();
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetFetchAndUpdatePostComponentState();
          this.dialogRef.close();
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }

  private resetFetchAndUpdatePostComponentState() {
    this.fetchAndUpdatePostSubscription?.unsubscribe();
    this.$fetchSinglePostSubmitted.set(false);
    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
  }

  onCancel() {
    this.dialogRef.close();
  }

  // This enables the display of the date and time from the input field values
  calculateCurrentDateTimeFromInputs(): Date | null {
    const date = this.scheduledDate.value;
    const hours = this.scheduledHours.value;
    const minutes = this.scheduledMinutes.value;
  
    if (date && hours !== null && minutes !== null) {
      return date.set({ hour: hours, minute: minutes }).toJSDate();
    }
    return null;
  }
  

  ngOnDestroy(): void {
    this.fetchAndUpdatePostSubscription?.unsubscribe();
  }

  get scheduledDate() { return this.scheduleForm.get(this.SCHEDULED_DATE_FORM_VALUE) as FormControl<DateTime>; }
  get scheduledHours() { return this.scheduleForm.get(this.SCHEDULED_HOURS_FORM_VALUE) as FormControl<number>; }
  get scheduledMinutes() { return this.scheduleForm.get(this.SCHEDULED_MINUTES_FORM_VALUE) as FormControl<number>; }
}
