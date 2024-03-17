import { Component, Input, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { GlobalFieldValues } from '../../../../../../shared-models/content/string-vals.model';
import { BlogIndexRef, PostKeys } from '../../../../../../shared-models/posts/post.model';
import { DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP, DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE, EMPTY_SPINNER_MESSAGE } from '../../../../../../shared-models/user-interface/dialogue-box-default-config.model';
import { Observable, Subscription, catchError, combineLatest, filter, map, switchMap, take, tap, throwError, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { UiService } from '../../../../core/services/ui.service';
import { PostStoreActions, PostStoreSelectors } from '../../../../root-store';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { ProcessingSpinnerComponent } from "../../../../shared/components/processing-spinner/processing-spinner.component";
import { ActionConfData } from '../../../../../../shared-models/forms/action-conf-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ActionConfirmDialogueComponent } from '../../../../shared/components/action-confirm-dialogue/action-confirm-dialogue.component';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-delete-post-button',
    standalone: true,
    templateUrl: './delete-post-button.component.html',
    styleUrl: './delete-post-button.component.scss',
    imports: [MatButtonModule, AsyncPipe, ProcessingSpinnerComponent, MatIcon]
})
export class DeletePostButtonComponent implements OnInit, OnDestroy {

  $blogIndexRef = input.required<BlogIndexRef>();

  DELETE_POST_CONF_BODY = GlobalFieldValues.DELETE_POST_CONF_BODY;
  DELETE_POST_CONF_TITLE = GlobalFieldValues.DELETE_POST_CONF_TITLE;
  EMPTY_SPINNER_MESSAGE = EMPTY_SPINNER_MESSAGE;

  private deletePostProcessing$!: Observable<boolean>;
  private deletePostSubscription!: Subscription;
  private deletePostError$!: Observable<{} | null>;
  private $deletePostSubmitted = signal(false);
  $deletePostCycleInit = signal(false);
  private $deletePostCycleComplete = signal(false);

  private publishPostProcessing$!: Observable<boolean>;
  serverRequestProcessing$!: Observable<boolean>;

  private store$ = inject(Store);
  private uiService = inject(UiService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.monitorProcesses();
  }

  private monitorProcesses() {
    this.deletePostProcessing$ = this.store$.select(PostStoreSelectors.selectDeletePostProcessing);
    this.deletePostError$ = this.store$.select(PostStoreSelectors.selectDeletePostError);

    this.publishPostProcessing$ = this.store$.select(PostStoreSelectors.selectPublishPostProcessing);

    this.serverRequestProcessing$ = combineLatest(
      [
        this.deletePostProcessing$, this.publishPostProcessing$
      ]
    ).pipe(
        map(([deleteProcessing, publishProcessing]) => {
          if (deleteProcessing || publishProcessing) {
            return true;
          }
          return false;
        })
    );
  }

  onDeletePost() {

    let dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE};
    if (!this.uiService.$screenIsMobile()) {
      dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP};
    }
    const actionConfData: ActionConfData = {
      title: this.DELETE_POST_CONF_TITLE,
      body: this.DELETE_POST_CONF_BODY,
    };

    dialogConfig.data = actionConfData;
    
    const dialogRef = this.dialog.open(ActionConfirmDialogueComponent, dialogConfig);

    const dialogActionObserver$: Observable<boolean> = dialogRef.afterClosed();
    
    this.deletePostSubscription = this.deletePostError$
      .pipe(
        switchMap(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe');
            this.resetComponentState();
          }
          return dialogActionObserver$;
        }),
        withLatestFrom(this.deletePostError$),
        tap(([dialogAction, processingError]) => {
          if (!dialogAction) {
            console.log('User canceled delete request');
          }
        }),
        filter(([dialogAction, processingError]) => !processingError && dialogAction),
        switchMap(processingError => {
          if (!this.$deletePostSubmitted()) {
            this.store$.dispatch(PostStoreActions.deletePostRequested({postId: this.$blogIndexRef()[PostKeys.ID]}));
            this.$deletePostSubmitted.set(true);
          }
          return this.deletePostProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(deleteProcessing => {
          if (deleteProcessing) {
            this.$deletePostCycleInit.set(true);
          }
          if (!deleteProcessing && this.$deletePostCycleInit()) {
            console.log('deletePost successful, proceeding with pipe.');
            this.$deletePostCycleInit.set(false);
            this.$deletePostCycleComplete.set(true);
          }
        }),
        filter(deleteProcessing => !deleteProcessing && this.$deletePostCycleComplete()),
        tap(deleteProcessing => {
          // this.uiService.showSnackBar(`Post deleted!`, 5000); // This triggers in the service instead because the component gets destroyed before reaching here
          this.deletePostSubscription?.unsubscribe();
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

  resetComponentState() {
    this.deletePostSubscription?.unsubscribe();

    this.$deletePostSubmitted = signal(false);
    this.$deletePostCycleInit = signal(false);
    this.$deletePostCycleComplete = signal(false);

    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
  }

  ngOnDestroy(): void {
    this.deletePostSubscription?.unsubscribe();

    this.deletePostError$
      .pipe(
        take(1),
        tap(error => {
          if (error) {
            this.store$.dispatch(PostStoreActions.purgePostStateErrors());
          }
        })
      ).subscribe();
  }

}
