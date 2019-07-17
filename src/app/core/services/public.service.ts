import { Injectable } from '@angular/core';
import { catchError, tap, take } from 'rxjs/operators';

import { AngularFireFunctions } from '@angular/fire/functions';
import { throwError } from 'rxjs';
import { GeographyListService } from './geography-list.service';
import { Post } from 'shared-models/posts/post.model';
import { AdminFunctionNames } from 'shared-models/routes-and-paths/fb-function-names';
import { Product } from 'shared-models/products/product.model';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(
    private fns: AngularFireFunctions,
    private geographyListService: GeographyListService
  ) { }

  // Submit http request to cloud functions to publish post updates or unpublish post
  async updatePublicPost(post: Post): Promise<any> {
    const callable = this.fns.httpsCallable(AdminFunctionNames.UPDATE_PUBLIC_BLOG_POST);

    const callPromise = new Promise<any>((resolve, reject) => {
      console.log('Calling function with this data', post);
      callable(post)
        .pipe(
          take(1),
          catchError(error => {
            console.log('Error updating post on public server', error);
            reject();
            return throwError(error);
          })
        ).subscribe(res => {
          console.log('Post updated on public server', res);
          resolve(res);
        });
    });

    return callPromise;
  }

  // Submit http request to cloud functions to update product
  updatePublicProduct(product: Product): Promise<any> {

    const callable = this.fns.httpsCallable(AdminFunctionNames.UPDATE_PRODUCT);

    const callPromise = new Promise<any>((resolve, reject) => {
      console.log('Calling function with this data', product);
      callable(product)
        .pipe(
          take(1),
          catchError(error => {
            console.log('Error updating product on public server', error);
            reject();
            return throwError(error);
          })
        ).subscribe(res => {
          console.log('Post updated on public server', res);
          resolve(res);
        });
    });

    return callPromise;

    // const callable = this.fns.httpsCallable(FbFunctionNames.UPDATE_PRODUCT);
    // callable(product)
    //   .pipe(
    //     take(1),
    //     tap(response => console.log('Product updated on public server', response)),
    //     catchError(error => {
    //       console.log('Error updating product on public server', error);
    //       return throwError(error);
    //     })
    //   ).subscribe();
  }

  updateGeographicData() {
    const geographicHttpCall = this.fns.httpsCallable(AdminFunctionNames.UPDATE_GEOGRAPHIC_DATA);

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

  sendSendgridTest() {
    const sendgridHttpCall = this.fns.httpsCallable('sendGridTest');

    sendgridHttpCall('')
      .pipe(
        take(1),
        tap(response => console.log('Sendgrid test sent', response)),
        catchError(error => {
          console.log('Error with sendgrid test', error);
          return throwError(error);
        })
      ).subscribe();
  }

}
