import { Injectable } from '@angular/core';
import { Post } from '../models/posts/post.model';
import { catchError, tap, take } from 'rxjs/operators';

import { AngularFireFunctions } from '@angular/fire/functions';
import { throwError } from 'rxjs';
import { GeographyListService } from './geography-list.service';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(
    private fns: AngularFireFunctions,
    private geographyListService: GeographyListService
  ) { }

  // Submit http request to cloud functions to publish or unpublish post
  updatePublicPost(post: Post): void {
    const callable = this.fns.httpsCallable('publishBlogPost');
    callable(post)
      .pipe(
        take(1),
        tap(response => console.log('Public post updated on public server', response)),
        catchError(error => {
          console.log('Error publishing post on public server', error);
          return throwError(error);
        })
      ).subscribe();
  }

  updateGeographicData() {
    const geographicHttpCall = this.fns.httpsCallable('updateGeographicData');

    this.geographyListService.updateGeographicData()
      .pipe(take(1))
      .subscribe(geographicData => {
        console.log('Data to send to server', geographicData);
        geographicHttpCall(geographicData)
          .pipe(
            take(1),
            tap(response => console.log('Geographic data updated on public server', response)),
            catchError(error => {
              console.log('Error updating geographic data on public server', error);
              return throwError(error);
            })
          ).subscribe();
      });
  }

}
