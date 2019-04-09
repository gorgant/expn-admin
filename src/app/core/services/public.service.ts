import { Injectable } from '@angular/core';
import { Post } from '../models/posts/post.model';
import { catchError, tap, take } from 'rxjs/operators';

import { AngularFireFunctions } from '@angular/fire/functions';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(
    private fns: AngularFireFunctions
  ) { }

  // Submit http request to cloud functions to publish post
  publishPublicPost(post: Post): void {
    const callable = this.fns.httpsCallable('publishBlogPost');
    callable(post)
      .pipe(
        take(1),
        tap(response => console.log('Post published', response)),
        catchError(error => {
          console.log('Error publishing post', error);
          return throwError(error);
        })
      ).subscribe();
  }
}
