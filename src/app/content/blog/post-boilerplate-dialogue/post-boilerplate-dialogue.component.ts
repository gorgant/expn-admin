import { Component, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { Observable, Subscription, catchError, filter, map, switchMap, take, tap, throwError, withLatestFrom } from 'rxjs';
import { PostBoilerplate, PostBoilerplateKeys } from '../../../../../shared-models/posts/post-boilerplate.model';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';
import { UiService } from '../../../core/services/ui.service';
import { PostStoreActions, PostStoreSelectors } from '../../../root-store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { ActionConfData } from '../../../../../shared-models/forms/action-conf-data.model';
import { DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP, DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE } from '../../../../../shared-models/user-interface/dialogue-box-default-config.model';
import { GlobalFieldValues } from '../../../../../shared-models/content/string-vals.model';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ProcessingSpinnerComponent } from '../../../shared/components/processing-spinner/processing-spinner.component';
import { ActionConfirmDialogueComponent } from '../../../shared/components/action-confirm-dialogue/action-confirm-dialogue.component';

@Component({
  selector: 'app-post-boilerplate-dialogue',
  standalone: true,
  imports: [CKEditorModule, AsyncPipe, MatButtonModule, ProcessingSpinnerComponent,ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './post-boilerplate-dialogue.component.html',
  styleUrl: './post-boilerplate-dialogue.component.scss'
})
export class PostBoilerplateDialogueComponent implements OnInit, OnDestroy {

  public Editor = ClassicEditor; // See https://ckeditor.com/docs/ckeditor5/latest/installation/integrations/angular.html for installation instructions

  DISCARD_EDITS_TITLE_VALUE = GlobalFieldValues.DISCARD_EDITS_TITLE;
  DISCARD_EDITS_BODY_VALUE = GlobalFieldValues.DISCARD_EDITS_BODY;
  DISCARD_EDITS_BUTTON_VALUE = GlobalFieldValues.DISCARD_EDITS_TITLE;
  SUBMIT_BUTTON_VALUE = GlobalFieldValues.SUBMIT;
  
  private postBoilerplateEditor = viewChild<CKEditorComponent>('postBoilerplateEditor');

  $localPostBoilerplate = signal(undefined as PostBoilerplate | undefined);
  $originalPostBoilerplate = signal(undefined as PostBoilerplate | undefined);

  private $fetchPostBoilerplateSubmitted = signal(false);
  private fetchPostBoilerplateError$!: Observable<{} | null>;
  private fetchPostBoilerplateProcessing$!: Observable<boolean>;
  private fetchPostBoilerplateSubscription!: Subscription;

  $discardEditsRequested = signal(false);

  private $updatePostBoilerplateCycleComplete = signal(false);
  $updatePostBoilerplateCycleInit = signal(false);
  private $updatePostBoilerplateSubmitted = signal(false);
  private updatePostBoilerplateError$!: Observable<{} | null>;
  private updatePostBoilerplateProcessing$!: Observable<boolean>;
  private updatePostBoilerplateSubscription!: Subscription;

  private fb = inject(FormBuilder);
  private store$ = inject(Store);
  private uiService = inject(UiService);
  private dialogRef = inject(MatDialogRef<PostBoilerplateDialogueComponent>);
  private dialog = inject(MatDialog);

  postBoilerplateForm = this.fb.group({
    [PostBoilerplateKeys.CONTENT]: ['']
  });

  ngOnInit(): void {
    this.monitorProcesses();
    this.patchExistingPostBoilerplateDataIntoForm();
  }

  private monitorProcesses() {
    this.fetchPostBoilerplateError$ = this.store$.select(PostStoreSelectors.selectFetchPostBoilerplateError);
    this.fetchPostBoilerplateProcessing$ = this.store$.select(PostStoreSelectors.selectFetchPostBoilerplateProcessing);

    this.updatePostBoilerplateError$ = this.store$.select(PostStoreSelectors.selectUpdatePostBoilerplateError);
    this.updatePostBoilerplateProcessing$ = this.store$.select(PostStoreSelectors.selectUpdatePostBoilerplateProcessing);
    
  }

  private patchExistingPostBoilerplateDataIntoForm() {
    const postBoilerplate$ = this.store$.select(PostStoreSelectors.selectPostBoilerplateData);
    
    this.fetchPostBoilerplateSubscription = this.fetchPostBoilerplateError$
      .pipe(
        switchMap(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe', processingError);
            this.resetPatchExistingPostBoilerplateDataIntoFormComponentState();
          }
          return postBoilerplate$;
        }),
        withLatestFrom(this.fetchPostBoilerplateError$),
        filter(([postBoilerplate, processingError]) => !processingError),
        map(([postBoilerplate, processingError]) => {
          if (!postBoilerplate && !this.$fetchPostBoilerplateSubmitted()) {
            this.$fetchPostBoilerplateSubmitted.set(true);
            console.log(`postBoilerplate not in store, fetching from database`);
            this.store$.dispatch(PostStoreActions.fetchPostBoilerplateRequested());
          }
          return postBoilerplate;
        }),
        filter(postBoilerplate => !!postBoilerplate),
        map(postBoilerplate => {
          // Store the original version in case changes are discarded
          if (postBoilerplate && !this.$originalPostBoilerplate()) {
            this.$originalPostBoilerplate.set(postBoilerplate); 
            console.log('Set originalPostBoilerplate', this.$originalPostBoilerplate());
          }

          // Only update the form and local instance if no local instance exists or changes are detected
          if (
              (postBoilerplate && !this.$localPostBoilerplate()) || 
              (postBoilerplate && this.$localPostBoilerplate()![PostBoilerplateKeys.CONTENT] !== postBoilerplate[PostBoilerplateKeys.CONTENT])
          ) {
            this.$localPostBoilerplate.set(postBoilerplate); // Load the current postBoilerplate into the instance variable
            console.log('Set localPostBoilerplate', this.$localPostBoilerplate());
            this.content.setValue(postBoilerplate[PostBoilerplateKeys.CONTENT]);
            console.log('Existing postBoilerplate form data patched');
          }
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetPatchExistingPostBoilerplateDataIntoFormComponentState();
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }

  private resetPatchExistingPostBoilerplateDataIntoFormComponentState() {
    this.fetchPostBoilerplateSubscription?.unsubscribe();
    this.$fetchPostBoilerplateSubmitted.set(false);
    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
    this.dialogRef.close();
  }

  onSubmitPostBoilerplateForm(): void {
    this.updateExistingPostBoilerplate(false);
  }

  private updateExistingPostBoilerplate(revertToOriginal: boolean) {
    this.postBoilerplateForm.disable();
    this.updatePostBoilerplateSubscription = this.updatePostBoilerplateError$
      .pipe(
        map(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe');
            this.resetUpdateExistingPostBoilerplateComponentState();
          }
          return processingError;
        }),
        filter(processingError => !processingError), // Halts function if processingError detected
        switchMap(processingError => {
          if (!this.$updatePostBoilerplateSubmitted()) {
            this.$updatePostBoilerplateSubmitted.set(true);

            let postBoilerplateUpdates: PostBoilerplate;

            if (!revertToOriginal) {
              postBoilerplateUpdates = {
                ...this.$localPostBoilerplate() as PostBoilerplate,
                [PostBoilerplateKeys.CONTENT]: this.content.value,
                [PostBoilerplateKeys.LAST_MODIFIED_TIMESTAMP]: DateTime.now().toMillis(),
              };
            } else {
              postBoilerplateUpdates = {
                ...this.$originalPostBoilerplate() as PostBoilerplate
              }
            }

            this.store$.dispatch(PostStoreActions.updatePostBoilerplateRequested({postBoilerplateUpdates}));
          }
          return this.updatePostBoilerplateProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(updateProcessing => {
          if (updateProcessing) {
            console.log('Boilerplate update processing');
            this.$updatePostBoilerplateCycleInit.set(true);
          }
          if (!updateProcessing && this.$updatePostBoilerplateCycleInit()) {
            console.log('updatePostBoilerplate successful, proceeding with pipe.');
            this.$updatePostBoilerplateCycleInit.set(false);
            this.$updatePostBoilerplateCycleComplete.set(true);
          }
        }),
        filter(updateProcessing => !updateProcessing && this.$updatePostBoilerplateCycleComplete()),
        tap(updateProcessing => {
          this.updatePostBoilerplateSubscription?.unsubscribe();
          if (this.$discardEditsRequested()) {
            this.uiService.showSnackBar(`Edits discarded!`, 5000);
            this.dialogRef.close();
          } else {
            this.uiService.showSnackBar(`PostBoilerplate updated!`, 5000);
            this.dialogRef.close();
          }
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetUpdateExistingPostBoilerplateComponentState();
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }

  private resetUpdateExistingPostBoilerplateComponentState() {
    this.updatePostBoilerplateSubscription?.unsubscribe();
    this.$updatePostBoilerplateSubmitted.set(false);
    this.$updatePostBoilerplateCycleInit.set(false);
    this.$updatePostBoilerplateCycleComplete.set(false);
    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
    this.postBoilerplateForm.enable();
  }

  // Check if user wants to discard changes
  onDiscardChanges() {
    if (this.formIsClean()) {
      console.log('Form is clean, no changes to discard');
      this.dialogRef.close();
      return;
    }
    
    let dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE};
    if (!this.uiService.$screenIsMobile()) {
      dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP};
    }

    dialogConfig.width = '800px';

    const actionConfData: ActionConfData = {
      title: this.DISCARD_EDITS_TITLE_VALUE,
      body: this.DISCARD_EDITS_BODY_VALUE,
    };

    dialogConfig.data = actionConfData;
    
    const dialogRef = this.dialog.open(ActionConfirmDialogueComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((confirmedDiscard: boolean) => {
        if (confirmedDiscard)
          this.updateExistingPostBoilerplate(true);
          this.$discardEditsRequested.set(true);
        })
  }

  private formIsClean(): boolean {
    const formIsClean = !this.content?.touched && !this.content?.dirty;
    return formIsClean;
  }

  ngOnDestroy(): void {
    this.fetchPostBoilerplateSubscription?.unsubscribe();
    this.updatePostBoilerplateSubscription?.unsubscribe();
  }

  get content() { return this.postBoilerplateForm.get(PostBoilerplateKeys.CONTENT) as FormControl<string>; }

}
