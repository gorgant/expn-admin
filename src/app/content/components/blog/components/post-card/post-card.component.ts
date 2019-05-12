import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { DeleteConfData } from 'src/app/core/models/forms-and-components/delete-conf-data.model';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { take } from 'rxjs/operators';
import { Post } from 'src/app/core/models/posts/post.model';
import { ImagePaths } from 'src/app/core/models/routes-and-paths/image-paths.model';
import { Store } from '@ngrx/store';
import { RootStoreState, PostStoreActions } from 'src/app/root-store';
import { TogglePublishedRequested, ToggleFeaturedRequested } from 'src/app/root-store/post-store/actions';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input() post: Post;
  heroPlaceholderPath = ImagePaths.HERO_PLACEHOLDER;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
  }

  onSelectBlogItem(postId) {
    this.router.navigate([AppRoutes.BLOG_EDIT_POST, postId]);
  }

  onTogglePublishPost() {
    console.log('Publish post toggled');
    this.store$.dispatch(new TogglePublishedRequested({post: this.post}));
  }

  onTogglePostFeatured() {
    console.log('Publish featured toggled');
    this.store$.dispatch(new ToggleFeaturedRequested({post: this.post}));
  }

  onPreviewBlogItem(postId) {
    this.router.navigate([AppRoutes.BLOG_PREVIEW_POST, postId]);
  }

  onDelete(postId: string) {
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
        console.log('User confirmed delete on card, dispatching delete action');
        this.store$.dispatch(new PostStoreActions.DeletePostRequested({postId}));
      }
    });
  }

}
