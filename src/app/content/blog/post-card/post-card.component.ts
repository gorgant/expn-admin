import { Component, OnInit, computed, inject, input } from '@angular/core';
import { BlogIndexRef, PostKeys } from '../../../../../shared-models/posts/post.model';
import { AdminAppRoutes, PublicAppRoutes } from '../../../../../shared-models/routes-and-paths/app-routes.model';
import { HelperService } from '../../../core/services/helpers.service';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { GlobalFieldValues } from '../../../../../shared-models/content/string-vals.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PublishPostButtonComponent } from "./publish-post-button/publish-post-button.component";
import { UnpublishPostButtonComponent } from "./unpublish-post-button/unpublish-post-button.component";
import { DeletePostButtonComponent } from "./delete-post-button/delete-post-button.component";
import { ToggleFeaturedPostButtonComponent } from "./toggle-featured-post-button/toggle-featured-post-button.component";
import { Observable, combineLatest, map } from 'rxjs';
import { PostStoreSelectors } from '../../../root-store';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP, DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE } from '../../../../../shared-models/user-interface/dialogue-box-default-config.model';
import { UiService } from '../../../core/services/ui.service';
import { SchedulePostDialogueComponent } from './schedule-post-dialogue/schedule-post-dialogue.component';

@Component({
    selector: 'app-post-card',
    standalone: true,
    templateUrl: './post-card.component.html',
    styleUrl: './post-card.component.scss',
    imports: [MatTooltipModule, MatButtonModule, AsyncPipe, DatePipe, MatButtonModule, MatIconModule, PublishPostButtonComponent, UnpublishPostButtonComponent, DeletePostButtonComponent, ToggleFeaturedPostButtonComponent, NgClass, DatePipe]
})
export class PostCardComponent implements OnInit {

  $blogIndexRef = input.required<BlogIndexRef>();

  APP_ROUTES = PublicAppRoutes;

  MODIFIED_BY_FIELD_VALUE = GlobalFieldValues.MODIFIED_BY;

  $postUrlSlug = computed(() => {
    const userFriendlyUrlString = this.helperService.convertToFriendlyUrlFormat(this.$blogIndexRef()[PostKeys.TITLE]);
    return userFriendlyUrlString;
  });
  $thumbnailSrc = computed(() => {
    return this.$blogIndexRef()[PostKeys.HERO_IMAGES].imageUrlSmall;
  });
  $lastModifiedTimestamp = computed(() => {
    return this.$blogIndexRef()[PostKeys.LAST_MODIFIED_TIMESTAMP] as number;
  });
  $scheduledAutopublishTimestamp = computed(() => {
    return this.$blogIndexRef()[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP] as number | null;
  });

  private publishPostProcessing$!: Observable<boolean>;
  private unpublishPostProcessing$!: Observable<boolean>;
  private toggleFeaturedPostProcessing$!: Observable<boolean>;
  private deletePostProcessing$!: Observable<boolean>;

  serverRequestProcessing$!: Observable<boolean>;

  private helperService = inject(HelperService);
  private store$ = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private uiService = inject(UiService);

  ngOnInit() {
    this.monitorProcesses();
  }

  private monitorProcesses() {
    this.publishPostProcessing$ = this.store$.select(PostStoreSelectors.selectPublishPostProcessing);
    this.unpublishPostProcessing$ = this.store$.select(PostStoreSelectors.selectUnpublishPostProcessing);
    this.toggleFeaturedPostProcessing$ = this.store$.select(PostStoreSelectors.selectToggleFeaturedPostProcessing);
    this.deletePostProcessing$ = this.store$.select(PostStoreSelectors.selectDeletePostProcessing);

    this.serverRequestProcessing$ = combineLatest(
      [
        this.publishPostProcessing$,
        this.unpublishPostProcessing$,
        this.toggleFeaturedPostProcessing$,
        this.deletePostProcessing$,
      ]
    ).pipe(
        map(([publishProcessing, unpublishProcessing, toggleProcessing, deleteProcessing]) => {
          if (publishProcessing || unpublishProcessing || toggleProcessing || deleteProcessing) {
            return true
          }
          return false
        })
    );
  }

  onPreviewPost() {
    this.router.navigate([AdminAppRoutes.BLOG, this.$blogIndexRef()[PostKeys.ID], this.$postUrlSlug()]);
  }

  onEditPost() {
    this.router.navigate([AdminAppRoutes.BLOG_EDIT_POST, this.$blogIndexRef()[PostKeys.ID]]);
  }

  onSchedulePost() {
    let dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE};
    if (!this.uiService.$screenIsMobile()) {
      dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP};
    }

    dialogConfig.data = this.$blogIndexRef();

    this.dialog.open(SchedulePostDialogueComponent, dialogConfig);
  }

}
