import { Injectable } from '@angular/core';
import { Post } from '../models/posts/post.model';
import { catchError, tap, take } from 'rxjs/operators';

import { AngularFireFunctions } from '@angular/fire/functions';
import { throwError } from 'rxjs';
import { CountryListService } from './country-list.service';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(
    private fns: AngularFireFunctions,
    private countryListService: CountryListService
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

  updateCountryList() {
    const callable = this.fns.httpsCallable('updateCountryList');
    this.countryListService.updateCountryData()
      .pipe(take(1))
      .subscribe(countryList => {
        console.log('List to send to server', countryList);
        callable(countryList)
          .pipe(
            take(1),
            tap(response => console.log('Country list updated on public server', response)),
            catchError(error => {
              console.log('Error updating country list on public server', error);
              return throwError(error);
            })
          ).subscribe();
      });
  }
}
