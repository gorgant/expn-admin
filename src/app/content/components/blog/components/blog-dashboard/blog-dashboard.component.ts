import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/core/services/post.service';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/models/posts/post.model';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';

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
  ) { }

  ngOnInit() {
    this.posts = this.postService.fetchAllPosts();
  }

  onCreatePost() {
    this.router.navigate([AppRoutes.BLOG_NEW_POST]);
  }

}
