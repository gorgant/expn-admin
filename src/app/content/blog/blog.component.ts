import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GlobalFieldValues } from '../../../../shared-models/content/string-vals.model';
import { PostCollectionComponent } from "./post-collection/post-collection.component";
import { Observable, catchError, filter, map, switchMap, take, tap, throwError, withLatestFrom } from 'rxjs';
import { BlogIndexRef } from '../../../../shared-models/posts/post.model';
import { FirebaseError } from '@angular/fire/app';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AdminAppRoutes } from '../../../../shared-models/routes-and-paths/app-routes.model';
import { UiService } from '../../core/services/ui.service';
import { BlogIndexRefStoreActions, BlogIndexRefStoreSelectors } from '../../root-store';
import { AsyncPipe } from '@angular/common';
import { ProcessingSpinnerComponent } from "../../shared/components/processing-spinner/processing-spinner.component";
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP, DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE } from '../../../../shared-models/user-interface/dialogue-box-default-config.model';
import { MatDialog } from '@angular/material/dialog';
import { PostBoilerplateDialogueComponent } from './post-boilerplate-dialogue/post-boilerplate-dialogue.component';

@Component({
    selector: 'app-blog',
    standalone: true,
    templateUrl: './blog.component.html',
    styleUrl: './blog.component.scss',
    imports: [ MatButtonModule, MatTabsModule, PostCollectionComponent, AsyncPipe, ProcessingSpinnerComponent, MatSlideToggleModule, FormsModule]
})
export class BlogComponent implements OnInit, OnDestroy {

  CREATE_POST_BUTTON_VALUE = GlobalFieldValues.CREATE_POST;
  EDIT_POST_BOILERPLATE_BUTTON_VALUE = GlobalFieldValues.EDIT_POST_BOILERPLATE;
  PUBLISHED_TAB_LABEL = GlobalFieldValues.PUBLISHED;
  UNPUBLISHED_TAB_LABEL = GlobalFieldValues.DRAFTS;

  private store$ = inject(Store);
  private uiService = inject(UiService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  private $fetchBlogIndexRefsSubmitted = signal(false);
  private allBlogIndexRefsFetched$!: Observable<boolean>;
  private fetchAllBlogIndexRefsError$!: Observable<FirebaseError | Error | null>
  private fetchAllBlogIndexRefsProcessing$!: Observable<boolean>;

  allBlogIndexRefs$!: Observable<BlogIndexRef[]>;
  publishedBlogIndexRefs$!: Observable<BlogIndexRef[]>;
  unpublishedBlogIndexRefs$!: Observable<BlogIndexRef[]>;
  featuredBlogIndexRefs$!: Observable<BlogIndexRef[]>;

  filterFeaturedPosts = false;

  ngOnInit(): void {
    this.monitorProcesses();
    this.fetchBlogIndexRefs();
  }

  private monitorProcesses() {
    this.allBlogIndexRefsFetched$ = this.store$.select(BlogIndexRefStoreSelectors.selectAllBlogIndexRefsFetched);
    this.fetchAllBlogIndexRefsError$ = this.store$.select(BlogIndexRefStoreSelectors.selectFetchAllBlogIndexRefsError);
    this.fetchAllBlogIndexRefsProcessing$ = this.store$.select(BlogIndexRefStoreSelectors.selectFetchAllBlogIndexRefsProcessing);

    this.publishedBlogIndexRefs$ = this.store$.select(BlogIndexRefStoreSelectors.selectAllPublishedBlogIndexRefs);
    this.unpublishedBlogIndexRefs$ = this.store$.select(BlogIndexRefStoreSelectors.selectAllUnpublishedBlogIndexRefs);
    this.featuredBlogIndexRefs$ = this.store$.select(BlogIndexRefStoreSelectors.selectAllFeaturedBlogIndexRefs);

  }

  private fetchBlogIndexRefs() {
    this.allBlogIndexRefs$ = this.fetchAllBlogIndexRefsError$
      .pipe(
        switchMap(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe', processingError);
            this.resetComponentState();
            this.navigateToHome();
          }
          const allBlogIndexRefsInStore = this.store$.select(BlogIndexRefStoreSelectors.selectAllBlogIndexRefsInStore);
          return allBlogIndexRefsInStore;
        }),
        withLatestFrom(this.fetchAllBlogIndexRefsError$, this.allBlogIndexRefsFetched$),
        filter(([blogIndexRefs, processingError, allFetched]) => !processingError),
        map(([blogIndexRefs, processingError, allFetched]) => {
          if (!allFetched && !this.$fetchBlogIndexRefsSubmitted()) {
            this.$fetchBlogIndexRefsSubmitted.set(true);
            this.store$.dispatch(BlogIndexRefStoreActions.fetchAllBlogIndexRefsRequested());
          }
          console.log('blogIndexRefs loaded into component', blogIndexRefs.length);
          return blogIndexRefs;
        }),
        filter(blogIndexRefs => blogIndexRefs.length > 0),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetComponentState();
          this.navigateToHome();
          return throwError(() => new Error(error));
        })
      )
  }

  private resetComponentState() {
    this.$fetchBlogIndexRefsSubmitted.set(false);
  }

  private navigateToHome() {
    this.router.navigate([AdminAppRoutes.HOME]);
  }


  onCreateNewPost() {
    this.router.navigate([AdminAppRoutes.BLOG_NEW_POST]);
  }

  onEditPostBoilerplate() {
    let dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE};
    if (!this.uiService.$screenIsMobile()) {
      dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP};
    }
    this.dialog.open(PostBoilerplateDialogueComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.fetchAllBlogIndexRefsError$
      .pipe(
        take(1),
        tap(error => {
          if (error) {
            this.store$.dispatch(BlogIndexRefStoreActions.purgeBlogIndexRefStateErrors());
          }
        })
      ).subscribe();
  }

}
