import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditEmailDialogueComponent } from '../../../profile/components/edit-email-dialogue/edit-email-dialogue.component';
import { Post, PostKeys } from 'shared-models/posts/post.model';
import { Store } from '@ngrx/store';
import { RootStoreState, PostStoreActions } from 'src/app/root-store';
import { SCHEDULE_POST_FORM_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-schedule-post-dialogue',
  templateUrl: './schedule-post-dialogue.component.html',
  styleUrls: ['./schedule-post-dialogue.component.scss']
})
export class SchedulePostDialogueComponent implements OnInit, OnDestroy {

  scheduleForm: FormGroup;
  schedulePostFormValidationMessages = SCHEDULE_POST_FORM_VALIDATION_MESSAGES;
  minDate = new Date(moment.now());
  useTouchUi: boolean;

  private screenObserverSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditEmailDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public post: Post,
    private store$: Store<RootStoreState.State>,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.configScheduleForm();
    this.configDatePickerType();

  }

  private configScheduleForm() {

    this.scheduleForm = this.fb.group({
      [PostKeys.PUBLISHED_DATE]: [moment.now(), [Validators.required]],
      publishHour: ['', [Validators.min(0), Validators.max(23)]],
      publishMin: ['', [Validators.min(0), Validators.max(59)]]
    });

    // If publish date available, convert published date to readable format
    if (this.post.scheduledPublishTime) {

      const dateString = this.post.scheduledPublishTime;
      this.scheduleForm.patchValue({
        [PostKeys.PUBLISHED_DATE]: moment(dateString),
        publishHour: moment(dateString).hours(),
        publishMin: moment(dateString).minutes(),
      });
    }
  }


  private configDatePickerType() {
    // Set Date picker type based on mobile or desktop
    this.screenObserverSubscription = this.uiService.screenIsMobile$
      .subscribe(screenIsMobile => {
        if (screenIsMobile) {
          this.useTouchUi = true;
        } else {
          this.useTouchUi = false;
        }
        console.log('Setting touch ui to', this.useTouchUi);
      });
  }

  onSave() {

    const dateNoTime = moment(
      this[PostKeys.PUBLISHED_DATE].value
    ).format('YYYY-MM-DD'); // Purge time from date value so that it adds properly
    const publishDateInMs: number = moment(dateNoTime, 'YYYY-MM-DD').valueOf(); // Convert purged value back to ms

    let publishHourInMs = 0;
    if (this.publishHour.value) {
      publishHourInMs = Number(this.publishHour.value) * 60 * 60 * 1000;
    }

    let publishMinInMs = 0;
    if (this.publishMin.value) {
      publishMinInMs = Number(this.publishMin.value) * 60 * 1000;
    }

    const newScheduledPublishTime: number = publishDateInMs + publishHourInMs + publishMinInMs;

    const updatedPost: Post = {
      ...this.post,
      scheduledPublishTime: newScheduledPublishTime
    };

    this.store$.dispatch( new PostStoreActions.UpdatePostRequested({
      post: updatedPost
    }));

    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close(false);
  }

  onClearTimer() {

    const updatedPost: Post = {
      ...this.post,
      scheduledPublishTime: null
    };

    this.store$.dispatch( new PostStoreActions.UpdatePostRequested({
      post: updatedPost
    }));

    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.screenObserverSubscription) {
      this.screenObserverSubscription.unsubscribe();
    }
  }

  // These getters are used for easy access in the HTML template
  get [PostKeys.PUBLISHED_DATE]() { return this.scheduleForm.get(PostKeys.PUBLISHED_DATE); }
  get publishHour() { return this.scheduleForm.get('publishHour'); }
  get publishMin() { return this.scheduleForm.get('publishMin'); }

}
