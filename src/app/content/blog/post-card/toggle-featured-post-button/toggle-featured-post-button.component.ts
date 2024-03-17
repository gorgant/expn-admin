import { Component, Input, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest, map, filter, switchMap, tap, catchError, throwError } from 'rxjs';
import { BlogIndexRef, PostKeys } from '../../../../../../shared-models/posts/post.model';
import { EMPTY_SPINNER_MESSAGE } from '../../../../../../shared-models/user-interface/dialogue-box-default-config.model';
import { UiService } from '../../../../core/services/ui.service';
import { PostStoreSelectors, PostStoreActions } from '../../../../root-store';
import { ProcessingSpinnerComponent } from "../../../../shared/components/processing-spinner/processing-spinner.component";
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-toggle-featured-post-button',
    standalone: true,
    templateUrl: './toggle-featured-post-button.component.html',
    styleUrl: './toggle-featured-post-button.component.scss',
    imports: [ProcessingSpinnerComponent, MatButtonModule, MatIconModule, AsyncPipe]
})
export class ToggleFeaturedPostButtonComponent implements OnInit, OnDestroy {

  $post = input.required<BlogIndexRef>();

  EMPTY_SPINNER_MESSAGE = EMPTY_SPINNER_MESSAGE;

  private toggleFeaturedPostProcessing$!: Observable<boolean>;
  private toggleFeaturedPostSubscription!: Subscription;
  private toggleFeaturedPostError$!: Observable<{} | null>;
  private $toggleFeaturedPostSubmitted = signal(false);
  $toggleFeaturedPostCycleInit = signal(false);
  private $toggleFeaturedPostCycleComplete = signal(false);

  private unpublishPostProcessing$!: Observable<boolean>;
  serverRequestProcessing$!: Observable<boolean>;

  private store$ = inject(Store);
  private uiService = inject(UiService);

  ngOnInit(): void {
    this.monitorProcesses();
  }

  private monitorProcesses() {
    this.toggleFeaturedPostProcessing$ = this.store$.select(PostStoreSelectors.selectToggleFeaturedPostProcessing);
    this.toggleFeaturedPostError$ = this.store$.select(PostStoreSelectors.selectToggleFeaturedPostError);

    this.unpublishPostProcessing$ = this.store$.select(PostStoreSelectors.selectUnpublishPostProcessing);

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

  onToggleFeaturedPost() {
    this.toggleFeaturedPostSubscription = this.toggleFeaturedPostError$
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
          if (!this.$toggleFeaturedPostSubmitted()) {
            this.store$.dispatch(PostStoreActions.toggleFeaturedPostRequested({postId: this.$post()[PostKeys.ID]}));
            this.$toggleFeaturedPostSubmitted.set(true);
          }
          return this.toggleFeaturedPostProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(publishProcessing => {
          if (publishProcessing) {
            this.$toggleFeaturedPostCycleInit.set(true);
          }
          if (!publishProcessing && this.$toggleFeaturedPostCycleInit()) {
            console.log('toggleFeaturedPost successful, proceeding with pipe.');
            this.$toggleFeaturedPostCycleInit.set(false);
            this.$toggleFeaturedPostCycleComplete.set(true);
          }
        }),
        filter(publishProcessing => !publishProcessing && this.$toggleFeaturedPostCycleComplete()),
        tap(publishProcessing => {
          this.uiService.showSnackBar(`toggleFeaturedPost successful!`, 5000);
          this.toggleFeaturedPostSubscription?.unsubscribe();
          this.resetComponentState(); // Reset so that it can be toggled again if needed
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
    this.toggleFeaturedPostSubscription?.unsubscribe();

    this.$toggleFeaturedPostSubmitted = signal(false);
    this.$toggleFeaturedPostCycleInit = signal(false);
    this.$toggleFeaturedPostCycleComplete = signal(false);

    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
  }

  ngOnDestroy(): void {
    this.toggleFeaturedPostSubscription?.unsubscribe();
  }
}
