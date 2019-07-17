import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootStoreState, PostStoreActions } from 'src/app/root-store';
import { Post } from 'shared-models/posts/post.model';
import { AdminImagePaths } from 'shared-models/routes-and-paths/image-paths.model';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { DeleteConfData } from 'shared-models/forms-and-components/delete-conf-data.model';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input() post: Post;
  heroPlaceholderPath = AdminImagePaths.HERO_PLACEHOLDER;
  thumbnailSrc: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    if (this.post.imageProps) {
      this.thumbnailSrc = this.post.imageProps.srcset.split(' ')[0]; // Get smallest image in the src set
    }
  }

  onSelectBlogItem() {
    this.router.navigate([AdminAppRoutes.BLOG_EDIT_POST, this.post.id]);
  }

  onTogglePublishPost() {
    console.log('Publish post toggled');
    this.store$.dispatch(new PostStoreActions.TogglePublishedRequested({post: this.post}));
  }

  onTogglePostFeatured() {
    console.log('Publish featured toggled');
    this.store$.dispatch(new PostStoreActions.ToggleFeaturedRequested({post: this.post}));
  }

  onPreviewBlogItem() {
    this.router.navigate([AdminAppRoutes.BLOG_PREVIEW_POST, this.post.id]);
  }

  onDelete() {
    const dialogConfig = new MatDialogConfig();

    const deleteConfData: DeleteConfData = {
      title: 'Delete Post',
      body: 'Are you sure you want to permanently delete this post?'
    };

    dialogConfig.data = deleteConfData;

    const dialogRef = this.dialog.open(DeleteConfirmDialogueComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe(userConfirmed => {
      if (userConfirmed) {
        this.store$.dispatch(new PostStoreActions.DeletePostRequested({postId: this.post.id}));
      }
    });
  }

}
