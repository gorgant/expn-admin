import { Component, Input, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map, filter, switchMap, tap, catchError, throwError, combineLatest } from 'rxjs';
import { GlobalFieldValues } from '../../../../../../shared-models/content/string-vals.model';
import { BlogIndexRef, PostKeys } from '../../../../../../shared-models/posts/post.model';
import { UiService } from '../../../../core/services/ui.service';
import { PostStoreSelectors, PostStoreActions } from '../../../../root-store';
import { MatButtonModule } from '@angular/material/button';
import { ProcessingSpinnerComponent } from "../../../../shared/components/processing-spinner/processing-spinner.component";
import { AsyncPipe } from '@angular/common';
import { EMPTY_SPINNER_MESSAGE } from '../../../../../../shared-models/user-interface/dialogue-box-default-config.model';

@Component({
    selector: 'app-publish-post-button',
    standalone: true,
    templateUrl: './publish-post-button.component.html',
    styleUrl: './publish-post-button.component.scss',
    imports: [MatButtonModule, ProcessingSpinnerComponent, AsyncPipe]
})
export class PublishPostButtonComponent implements OnInit, OnDestroy {

  $blogIndexRef = input.required<BlogIndexRef>();

  PUBLISH_BUTTON_VALUE = GlobalFieldValues.PUBLISH;
  EMPTY_SPINNER_MESSAGE = EMPTY_SPINNER_MESSAGE;

  private publishPostProcessing$!: Observable<boolean>;
  private publishPostSubscription!: Subscription;
  private publishPostError$!: Observable<{} | null>;
  private $publishPostSubmitted = signal(false);
  $publishPostCycleInit = signal(false);
  private $publishPostCycleComplete = signal(false);

  private deletePostProcessing$!: Observable<boolean>;
  serverRequestProcessing$!: Observable<boolean>;

  private store$ = inject(Store);
  private uiService = inject(UiService);

  ngOnInit(): void {
    this.monitorProcesses();
  }

  private monitorProcesses() {
    this.publishPostProcessing$ = this.store$.select(PostStoreSelectors.selectPublishPostProcessing);
    this.publishPostError$ = this.store$.select(PostStoreSelectors.selectPublishPostError);

    this.deletePostProcessing$ = this.store$.select(PostStoreSelectors.selectDeletePostProcessing);

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

  onPublishPost() {
    this.publishPostSubscription = this.publishPostError$
      .pipe(
        map(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe');
            this.resetComponentState();
          }
          return processingError;
        }),
        filter(processingError => !processingError), // Halts function if processingError detected
        switchMap(processingError => {
          if (!this.$publishPostSubmitted()) {
            this.store$.dispatch(PostStoreActions.publishPostRequested({postId: this.$blogIndexRef()[PostKeys.ID]}));
            this.$publishPostSubmitted.set(true);
          }
          return this.publishPostProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(publishProcessing => {
          if (publishProcessing) {
            this.$publishPostCycleInit.set(true);
          }
          if (!publishProcessing && this.$publishPostCycleInit()) {
            console.log('publishPost successful, proceeding with pipe.');
            this.$publishPostCycleInit.set(false);
            this.$publishPostCycleComplete.set(true);
          }
        }),
        filter(publishProcessing => !publishProcessing && this.$publishPostCycleComplete()),
        tap(publishProcessing => {
          this.uiService.showSnackBar(`Post published!`, 5000);
          this.publishPostSubscription?.unsubscribe();
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
    this.publishPostSubscription?.unsubscribe();

    this.$publishPostSubmitted = signal(false);
    this.$publishPostCycleInit = signal(false);
    this.$publishPostCycleComplete = signal(false);

    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
  }

  ngOnDestroy(): void {
    this.publishPostSubscription?.unsubscribe();
  }
}
