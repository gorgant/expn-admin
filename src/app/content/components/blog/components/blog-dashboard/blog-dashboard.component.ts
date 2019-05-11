import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/models/posts/post.model';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { Store } from '@ngrx/store';
import { RootStoreState, PostStoreSelectors, PostStoreActions } from 'src/app/root-store';
import { withLatestFrom, map } from 'rxjs/operators';

@Component({
  selector: 'app-blog-dashboard',
  templateUrl: './blog-dashboard.component.html',
  styleUrls: ['./blog-dashboard.component.scss']
})
export class BlogDashboardComponent implements OnInit {

  posts$: Observable<Post[]>;

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    this.initializePosts();
  }

  onCreatePost() {
    this.router.navigate([AppRoutes.BLOG_NEW_POST]);
  }

  private initializePosts() {
    this.posts$ = this.store$.select(PostStoreSelectors.selectAllPosts)
    .pipe(
      withLatestFrom(
        this.store$.select(PostStoreSelectors.selectPostsLoaded)
      ),
      map(([posts, postsLoaded]) => {
        // Check if posts are loaded, if not fetch from server
        if (!postsLoaded) {
          this.store$.dispatch(new PostStoreActions.AllPostsRequested());
        }
        return posts;
      })
    );
  }

}
