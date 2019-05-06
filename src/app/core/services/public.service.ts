import { Injectable } from '@angular/core';
import { Post } from '../models/posts/post.model';
import { catchError, tap, take } from 'rxjs/operators';

import { AngularFireFunctions } from '@angular/fire/functions';
import { throwError } from 'rxjs';
import { GeographyListService } from './geography-list.service';
import { Product } from '../models/products/product.model';
import { FbFunctionNames } from '../models/routes-and-paths/fb-function-names';

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
    const callable = this.fns.httpsCallable(FbFunctionNames.PUBLISH_BLOG_POST);
    callable(post)
      .pipe(
        take(1),
        tap(response => console.log('Post updated on public server', response)),
        catchError(error => {
          console.log('Error publishing post on public server', error);
          return throwError(error);
        })
      ).subscribe();
  }

  // Submit http request to cloud functions to activate or deactivate product
  updatePublicProduct(product: Product): void {
    const callable = this.fns.httpsCallable(FbFunctionNames.UPDATE_PRODUCT);
    callable(product)
      .pipe(
        take(1),
        tap(response => console.log('Product updated on public server', response)),
        catchError(error => {
          console.log('Error updating product on public server', error);
          return throwError(error);
        })
      ).subscribe();
  }

  updateGeographicData() {
    const geographicHttpCall = this.fns.httpsCallable(FbFunctionNames.UPDATE_GEOGRAPHIC_DATA);

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
