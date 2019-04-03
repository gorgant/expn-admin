import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/core/services/post.service';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/models/posts/post.model';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { take } from 'rxjs/operators';
import { DeleteConfData } from 'src/app/core/models/forms/delete-conf-data.model';

@Component({
  selector: 'app-blog-dashboard',
  templateUrl: './blog-dashboard.component.html',
  styleUrls: ['./blog-dashboard.component.scss']
})
export class BlogDashboardComponent implements OnInit {

  posts: Observable<Post[]>;

  constructor(
    private postService: PostService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.posts = this.postService.getPosts();
  }

  onCreatePost() {
    this.router.navigate([AppRoutes.BLOG_NEW_POST]);
  }

  onDelete(id: string) {
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
        this.deletePost(id);
      }
    });
  }

  private deletePost(id: string) {
    this.postService.deletePost(id);
  }

}
