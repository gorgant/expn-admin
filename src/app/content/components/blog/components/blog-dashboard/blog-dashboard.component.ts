import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootStoreState, PostStoreSelectors, PostStoreActions } from 'src/app/root-store';
import { withLatestFrom, map } from 'rxjs/operators';
import { Post } from 'shared-models/posts/post.model';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';

@Component({
  selector: 'app-blog-dashboard',
  templateUrl: './blog-dashboard.component.html',
  styleUrls: ['./blog-dashboard.component.scss']
})
export class BlogDashboardComponent implements OnInit {

  posts$: Observable<Post[]>;
  deletionProcessing$: Observable<boolean>;

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    this.initializePosts();
  }

  onCreatePost() {
    this.router.navigate([AdminAppRoutes.BLOG_NEW_POST]);
  }

  private initializePosts() {
    this.posts$ = this.store$.select(PostStoreSelectors.selectAllPosts)
    .pipe(
      withLatestFrom(
        this.store$.select(PostStoreSelectors.selectLoaded),
        this.store$.select(PostStoreSelectors.selectIsDeleting), // Prevents error loading deleted data
      ),
      map(([posts, postsLoaded, deletionProcessing]) => {
        // Check if posts are loaded, if not fetch from server
        if (!postsLoaded && !deletionProcessing) {
          this.store$.dispatch(new PostStoreActions.AllPostsRequested());
        }
        return posts;
      })
    );
  }

}
