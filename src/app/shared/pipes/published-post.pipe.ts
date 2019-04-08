import { Pipe, PipeTransform } from '@angular/core';
import { Post } from 'src/app/core/models/posts/post.model';

@Pipe({
  name: 'publishedPostFilter'
})
export class PublishedPostPipe implements PipeTransform {

  transform(posts: Post[]): any[] {

    if (!posts) {
      return [];
    }

    // Return published posts and sort by date published
    return posts.filter(post =>
      post.published
    ).sort((a, b) => b.publishedDate - a.publishedDate);


  }

}
