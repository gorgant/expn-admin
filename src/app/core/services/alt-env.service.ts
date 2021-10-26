import { Injectable } from '@angular/core';

import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Product } from 'shared-models/products/product.model';
import { Observable, throwError } from 'rxjs';
import * as firestore from '@google-cloud/firestore';
import { AdminFunctionNames } from 'shared-models/routes-and-paths/fb-function-names';
import { take, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AltEnvService {

  constructor(
    private fns: AngularFireFunctions,
  ) { }

  // Submit http request to cloud functions to update product
  cloneProductOnAltAdmin(product: Product): Observable<firestore.WriteResult> {

    const cloneProductHttpCall: (product: Product) => Observable<firestore.WriteResult> = this.fns.httpsCallable(
      AdminFunctionNames.CLONE_PRODUCT_ON_ALT_ADMIN
    );

    const updateProductRes = cloneProductHttpCall(product)
      .pipe(
        take(1),
        tap(res => {
          console.log('Product cloned on alt admin', res);
          // throw new Error('Fake product update error');
        }),
        catchError(error => {
          console.log('Error ucloing product on alt admin', error);
          return throwError(error);
        })
      );
    return updateProductRes;
  }
}
