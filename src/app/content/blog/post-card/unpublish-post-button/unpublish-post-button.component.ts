import { Component, Input, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map, filter, switchMap, tap, catchError, throwError, combineLatest } from 'rxjs';
import { GlobalFieldValues } from '../../../../../../shared-models/content/string-vals.model';
import { BlogIndexRef, PostKeys } from '../../../../../../shared-models/posts/post.model';
import { UiService } from '../../../../core/services/ui.service';
import { PostStoreSelectors, PostStoreActions } from '../../../../root-store';
import { ProcessingSpinnerComponent } from "../../../../shared/components/processing-spinner/processing-spinner.component";
import { MatButtonModule } from '@angular/material/button';
import { EMPTY_SPINNER_MESSAGE } from '../../../../../../shared-models/user-interface/dialogue-box-default-config.model';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-unpublish-post-button',
    standalone: true,
    templateUrl: './unpublish-post-button.component.html',
    styleUrl: './unpublish-post-button.component.scss',
    imports: [ProcessingSpinnerComponent, MatButtonModule, AsyncPipe]
})
export class UnpublishPostButtonComponent implements OnInit, OnDestroy {

  $blogIndexRef = input.required<BlogIndexRef>();

  UNPUBLISH_BUTTON_VALUE = GlobalFieldValues.UNPUBLISH;
  EMPTY_SPINNER_MESSAGE = EMPTY_SPINNER_MESSAGE;

  private unpublishPostProcessing$!: Observable<boolean>;
  private unpublishPostSubscription!: Subscription;
  private unpublishPostError$!: Observable<{} | null>;
  private $unpublishPostSubmitted = signal(false);
  $unpublishPostCycleInit = signal(false);
  private $unpublishPostCycleComplete = signal(false);

  private toggleFeaturedPostProcessing$!: Observable<boolean>;
  serverRequestProcessing$!: Observable<boolean>;

  private store$ = inject(Store);
  private uiService = inject(UiService);

  ngOnInit(): void {
    this.monitorProcesses();
  }

  private monitorProcesses() {
    this.unpublishPostProcessing$ = this.store$.select(PostStoreSelectors.selectUnpublishPostProcessing);
    this.unpublishPostError$ = this.store$.select(PostStoreSelectors.selectUnpublishPostError);

    this.toggleFeaturedPostProcessing$ = this.store$.select(PostStoreSelectors.selectToggleFeaturedPostProcessing);

    this.serverRequestProcessing$ = combineLatest(
      [
        this.unpublishPostProcessing$, this.toggleFeaturedPostProcessing$
      ]
    ).pipe(
        map(([unpublishProcessing, toggleProcessing]) => {
          if (unpublishProcessing || toggleProcessing) {
            return true;
          }
          return false;
        })
    );

  }

  onUnpublishPost() {
    this.unpublishPostSubscription = this.unpublishPostError$
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
          if (!this.$unpublishPostSubmitted()) {
            this.store$.dispatch(PostStoreActions.unpublishPostRequested({postId: this.$blogIndexRef()[PostKeys.ID]}));
            this.$unpublishPostSubmitted.set(true);
          }
          return this.unpublishPostProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(unpublishProcessing => {
          if (unpublishProcessing) {
            this.$unpublishPostCycleInit.set(true);
          }
          if (!unpublishProcessing && this.$unpublishPostCycleInit()) {
            console.log('unpublishPost successful, proceeding with pipe.');
            this.$unpublishPostCycleInit.set(false);
            this.$unpublishPostCycleComplete.set(true);
          }
        }),
        filter(unpublishProcessing => !unpublishProcessing && this.$unpublishPostCycleComplete()),
        tap(unpublishProcessing => {
          this.uiService.showSnackBar(`Post unpublished!`, 5000);
          this.unpublishPostSubscription?.unsubscribe();
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
    this.unpublishPostSubscription?.unsubscribe();
    
    this.$unpublishPostSubmitted = signal(false);
    this.$unpublishPostCycleInit = signal(false);
    this.$unpublishPostCycleComplete = signal(false);

    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
  }

  ngOnDestroy(): void {
    this.unpublishPostSubscription?.unsubscribe();
  }
}
