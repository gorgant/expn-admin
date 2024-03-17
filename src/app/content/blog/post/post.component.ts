import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { PostHeroComponent } from "./post-hero/post-hero.component";
import { Post, PostKeys } from '../../../../../shared-models/posts/post.model';
import { PostContentComponent } from "./post-content/post-content.component";
import { PostVideoPlayerComponent } from "./post-video-player/post-video-player.component";
import { PostPodcastPlayerComponent } from "./post-podcast-player/post-podcast-player.component";
import { GlobalFieldValues } from '../../../../../shared-models/content/string-vals.model';
import { PublicAppRoutes } from '../../../../../shared-models/routes-and-paths/app-routes.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription, catchError, combineLatest, filter, map, switchMap, take, tap, throwError, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { PostStoreActions, PostStoreSelectors } from '../../../root-store';
import { UiService } from '../../../core/services/ui.service';
import { AsyncPipe } from '@angular/common';
import { ProcessingSpinnerComponent } from "../../../shared/components/processing-spinner/processing-spinner.component";
import { PostBoilerplate } from '../../../../../shared-models/posts/post-boilerplate.model';

@Component({
    selector: 'app-post',
    standalone: true,
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss',
    imports: [PostHeroComponent, PostContentComponent, PostVideoPlayerComponent, PostPodcastPlayerComponent, RouterLink, MatButtonModule, AsyncPipe, ProcessingSpinnerComponent]
})
export class PostComponent implements OnInit, OnDestroy {

  VIEW_MORE_POSTS_BUTTON_VALUE = GlobalFieldValues.VIEW_MORE_POSTS;
  APP_ROUTES = PublicAppRoutes;

  private $fetchSinglePostSubmitted = signal(false);
  private $postId = signal(undefined as string | undefined);
  private fetchPostError$!: Observable<{} | null>;
  private fetchPostProcessing$!: Observable<boolean>;
  private fetchPostSubscription!: Subscription;

  private $fetchPostBoilerplateSubmitted = signal(false);
  private fetchPostBoilerplateError$!: Observable<{} | null>;
  private fetchPostBoilerplateProcessing$!: Observable<boolean>;
  private fetchPostBoilerplateSubscription!: Subscription;
  

  private $post = signal(undefined as Post | undefined);
  private $postBoilerplate = signal(undefined as PostBoilerplate | undefined);

  $combinedPostData = computed(() => {
    return {
      post: this.$post(),
      postBoilerplate: this.$postBoilerplate()
    }
  });

  private store$ = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private uiService = inject(UiService);
  

  ngOnInit(): void {
    this.monitorProcesses();
    this.fetchPostData();
    this.fetchPostBoilerplateData();
    
  }

  private monitorProcesses() {
    this.fetchPostProcessing$ = this.store$.select(PostStoreSelectors.selectFetchSinglePostProcessing);
    this.fetchPostError$ = this.store$.select(PostStoreSelectors.selectFetchSinglePostError);
    
    this.fetchPostBoilerplateError$ = this.store$.select(PostStoreSelectors.selectFetchPostBoilerplateError);
    this.fetchPostBoilerplateProcessing$ = this.store$.select(PostStoreSelectors.selectFetchPostBoilerplateProcessing);
    
  }


  private setPostId() {
    const postId = this.route.snapshot.params[PostKeys.ID];
    this.$postId.set(postId);
  }

  private fetchPostData() {
    this.setPostId();

    if (!this.$postId()) {
      console.error('No postId found in url, routing to home');
      this.navigateToHome();
    }

     this.fetchPostSubscription = this.fetchPostError$
      .pipe(
        switchMap(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe', processingError);
            this.resetFetchPostComponentState();
            this.navigateToHome();
          }
          const singlePost$ = this.store$.select(PostStoreSelectors.selectPostById(this.$postId()!));
          return singlePost$;
        }),
        withLatestFrom(this.fetchPostError$),
        filter(([post, processingError]) => !processingError),
        map(([post, processingError]) => {
          if (!post && !this.$fetchSinglePostSubmitted()) {
            console.log(`Post ${this.$postId()} not in store, fetching from database`);
            this.$fetchSinglePostSubmitted.set(true);
            this.store$.dispatch(PostStoreActions.fetchSinglePostRequested({postId: this.$postId()!}));
          }
          return post as Post;
        }),
        filter(post => !!post),
        tap(post => {
          this.$post.set(post);
          console.log('Set post data', post);
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 10000);
          this.resetFetchPostComponentState();
          this.navigateToHome();
          return throwError(() => new Error(error));
        })
      ).subscribe();

  }

  private resetFetchPostComponentState() {
    this.$fetchSinglePostSubmitted.set(false);
    this.fetchPostSubscription?.unsubscribe();
    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
  }

  private fetchPostBoilerplateData() {
    const postBoilerplate$ = this.store$.select(PostStoreSelectors.selectPostBoilerplateData);
    
    this.fetchPostBoilerplateSubscription = this.fetchPostBoilerplateError$
      .pipe(
        switchMap(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe', processingError);
            this.resetFetchPostBoilerplateComponentState();
            this.navigateToHome();
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
          if (postBoilerplate) {
            this.$postBoilerplate.set(postBoilerplate); 
            console.log('Set postBoilerplate', this.$postBoilerplate());
          }
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetFetchPostBoilerplateComponentState();
          this.navigateToHome();
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }

  private resetFetchPostBoilerplateComponentState() {
    this.$fetchPostBoilerplateSubmitted.set(false);
    this.fetchPostBoilerplateSubscription?.unsubscribe();
    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
  }

  private navigateToHome() {
    this.router.navigate([PublicAppRoutes.HOME]);
  }


  ngOnDestroy(): void {

    this.fetchPostSubscription?.unsubscribe();
    this.fetchPostBoilerplateSubscription?.unsubscribe();

    combineLatest([this.fetchPostError$, this.fetchPostBoilerplateError$])
      .pipe(
        take(1),
        tap(([fetchPostError, fetchPostBoilerplateError]) => {
          if (fetchPostError || fetchPostBoilerplateError) {
            this.store$.dispatch(PostStoreActions.purgePostStateErrors());
          }
        })
      ).subscribe();
  }


}
