import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootStoreState, PostStoreActions, PostStoreSelectors } from 'src/app/root-store';
import { Post } from 'shared-models/posts/post.model';
import { AdminImagePaths } from 'shared-models/routes-and-paths/image-paths.model';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { SchedulePostDialogueComponent } from '../schedule-post-dialogue/schedule-post-dialogue.component';
import { UiService } from 'src/app/core/services/ui.service';
import { Observable } from 'rxjs';
import { ActionConfirmDialogueComponent } from 'src/app/shared/components/action-confirm-dialogue/action-confirm-dialogue.component';
import { ActionConfData } from 'shared-models/forms-and-components/action-conf-data.model';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input() post: Post;
  postUrlSlug: string;
  heroPlaceholderPath = AdminImagePaths.HERO_PLACEHOLDER;
  thumbnailSrc: string;
  isTogglingPublished$: Observable<boolean>;
  isTogglingFeatured$: Observable<boolean>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.setUserFriendlyUrlString();
    if (this.post.imageProps) {
      this.thumbnailSrc = this.post.imageProps.srcset.split(' ')[0]; // Get smallest image in the src set
    }
  }

  private setUserFriendlyUrlString() {
    this.postUrlSlug = this.uiService.convertToFriendlyUrlFormat(this.post.title);
  }

  onSelectBlogItem() {
    this.router.navigate([AdminAppRoutes.BLOG_EDIT_POST, this.post.id]);
  }

  onTogglePublishPost() {
    console.log('Publish post toggled');
    this.isTogglingPublished$ = this.store$.select(PostStoreSelectors.selectIsTogglingPublished);
    this.store$.dispatch(new PostStoreActions.TogglePublishedRequested({post: this.post}));
  }

  onSchedulePost() {
    console.log('Post schedule selected');
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = this.post;
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = 300;

    const dialogRef = this.dialog.open(SchedulePostDialogueComponent, dialogConfig);

  }

  onTogglePostFeatured() {
    console.log('Publish featured toggled');
    this.isTogglingFeatured$ = this.store$.select(PostStoreSelectors.selectIsTogglingFeatured);
    this.store$.dispatch(new PostStoreActions.ToggleFeaturedRequested({post: this.post}));
  }

  onPreviewBlogItem() {
    this.router.navigate([AdminAppRoutes.BLOG_PREVIEW_POST, this.post.id, this.postUrlSlug]);
  }

  onDelete() {
    const dialogConfig = new MatDialogConfig();

    const deleteConfData: ActionConfData = {
      title: 'Delete Post',
      body: 'Are you sure you want to permanently delete this post?'
    };

    dialogConfig.data = deleteConfData;

    const dialogRef = this.dialog.open(ActionConfirmDialogueComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe(userConfirmed => {
      if (userConfirmed) {
        this.store$.dispatch(new PostStoreActions.DeletePostRequested({postId: this.post.id}));
      }
    });
  }

}
