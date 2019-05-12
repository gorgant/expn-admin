import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as productFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { ProductService } from 'src/app/core/services/product.service';

@Injectable()
export class ProductStoreEffects {
  constructor(
    private productService: ProductService,
    private actions$: Actions,
  ) { }

  @Effect()
  singleProductRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.SingleProductRequested>(
      productFeatureActions.ActionTypes.SINGLE_PRODUCT_REQUESTED
    ),
    mergeMap(action =>
      this.productService.fetchSingleProduct(action.payload.productId)
        .pipe(
          map(product => new productFeatureActions.SingleProductLoaded({ product })),
          catchError(error => {
            return of(new productFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  allProductsRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.AllProductsRequested>(
      productFeatureActions.ActionTypes.ALL_PRODUCTS_REQUESTED
    ),
    switchMap(action =>
      this.productService.fetchAllProducts()
        .pipe(
          map(products => new productFeatureActions.AllProductsLoaded({ products })),
          catchError(error => {
            return of(new productFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );
}
