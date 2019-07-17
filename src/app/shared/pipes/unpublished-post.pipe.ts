import { Pipe, PipeTransform } from '@angular/core';
import { Post } from 'shared-models/posts/post.model';

@Pipe({
  name: 'unpublishedPostFilter'
})
export class UnpublishedPostPipe implements PipeTransform {

  transform(posts: Post[]): any[] {

    if (!posts) {
      return [];
    }

    // Return unpublished posts and sort by date modified
    return posts.filter(post =>
      !post.published
    ).sort((a, b) =>  b.modifiedDate - a.modifiedDate);


  }

}
