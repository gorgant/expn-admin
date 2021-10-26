import { Injectable } from '@angular/core';
import { catchError, tap, take } from 'rxjs/operators';

import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { throwError, Observable } from 'rxjs';
import { GeographyListService } from './geography-list.service';
import { Post } from 'shared-models/posts/post.model';
import { AdminFunctionNames } from 'shared-models/routes-and-paths/fb-function-names';
import { Product } from 'shared-models/products/product.model';
import * as firestore from '@google-cloud/firestore';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(
    private fns: AngularFireFunctions,
    private geographyListService: GeographyListService,
    private uiService: UiService
  ) { }

  // Submit http request to cloud functions to publish post updates or unpublish post
  updatePublicPost(post: Post): Observable<firestore.WriteResult> {
    const updatePostHttpCall: (post: Post) => Observable<firestore.WriteResult> = this.fns.httpsCallable(
      AdminFunctionNames.UPDATE_PUBLIC_BLOG_POST
    );

    const updatePostRes = updatePostHttpCall(post)
      .pipe(
        take(1),
        tap(res => {
          console.log('Post updated on public server', res);
        }),
        catchError(error => {
          console.log('Error updating post on public server', error);
          return throwError(error);
        })
      );
    return updatePostRes;
  }

  // Submit http request to cloud functions to update product
  updatePublicProduct(product: Product): Observable<firestore.WriteResult> {

    const updateProductHttpCall: (product: Product) => Observable<firestore.WriteResult> = this.fns.httpsCallable(
      AdminFunctionNames.UPDATE_PRODUCT
    );

    const updateProductRes = updateProductHttpCall(product)
      .pipe(
        take(1),
        tap(res => {
          console.log('Product updated on public server', res);
          // throw new Error('Fake product update error');
        }),
        catchError(error => {
          console.log('Error updating product on public server', error);
          return throwError(error);
        })
      );
    return updateProductRes;
  }

  updateGeographicData() {
    const geographicHttpCall = this.fns.httpsCallable(AdminFunctionNames.UPDATE_GEOGRAPHIC_DATA);

    this.geographyListService.updateGeographicData()
      .pipe(
        take(1),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          console.log('Error updating local geographic data', error);
          return throwError(error);
        })
      )
      .subscribe(geographicData => {
        console.log('Data to send to server', geographicData);
        geographicHttpCall(geographicData)
          .pipe(
            take(1),
            tap(response => console.log('Geographic data updated on public server', response)),
            catchError(error => {
              this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
              console.log('Error updating geographic data on public server', error);
              return throwError(error);
            })
          ).subscribe((res) => res, err => {
            throw new Error('Error updating geographic data on server');
          } );
      }, error => {
        throw new Error('Error updating local geographic data');
      });
  }

}
