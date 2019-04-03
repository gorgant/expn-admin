import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/core/services/post.service';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/models/post-models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-dashboard',
  templateUrl: './blog-dashboard.component.html',
  styleUrls: ['./blog-dashboard.component.scss']
})
export class BlogDashboardComponent implements OnInit {

  posts: Observable<Post[]>;

  constructor(
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit() {
    this.posts = this.postService.getPosts();
    console.log(this);
  }

  onCreatePost() {
    this.router.navigate(['/blog/new']);
  }

  onDelete(id: string) {
    this.postService.deletePost(id);
  }

}
