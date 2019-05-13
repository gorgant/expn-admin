import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as productFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap, tap } from 'rxjs/operators';
import { ProductService } from 'src/app/core/services/product.service';
import { Update } from '@ngrx/entity';
import { Product } from 'shared-models/products/product.model';
import { RootStoreState } from '..';

@Injectable()
export class ProductStoreEffects {
  constructor(
    private productService: ProductService,
    private actions$: Actions,
    private store$: Store<RootStoreState.State>,
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

  @Effect()
  addProductEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.AddProductRequested>(
      productFeatureActions.ActionTypes.ADD_PRODUCT_REQUESTED
    ),
    mergeMap(action => this.productService.createProduct(action.payload.product).pipe(
      map(product => {
        return new productFeatureActions.AddProductComplete({product});
      }),
      catchError(error => {
        return of(new productFeatureActions.LoadErrorDetected({ error }));
      })
    )),
  );

  @Effect()
  deleteProductEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.DeleteProductRequested>(
      productFeatureActions.ActionTypes.DELETE_PRODUCT_REQUESTED
    ),
    switchMap(action => this.productService.deleteProduct(action.payload.productId)
      .pipe(
          map(productId => new productFeatureActions.DeleteProductComplete({productId})),
          catchError(error => {
            return of(new productFeatureActions.LoadErrorDetected({ error }));
          })
        )
    ),
  );

  @Effect()
  updateProductEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.UpdateProductRequested>(
      productFeatureActions.ActionTypes.UPDATE_PRODUCT_REQUESTED
    ),
    switchMap(action => this.productService.updateProduct(action.payload.product)
      .pipe(
          map(product => {
            const productUpdate: Update<Product> = {
              id: product.id,
              changes: product
            };
            return new productFeatureActions.UpdateProductComplete({ product: productUpdate });
          }),
          catchError(error => {
            return of(new productFeatureActions.LoadErrorDetected({ error }));
          })
        )
    ),
  );

  @Effect()
  toggleActiveEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.ToggleActiveRequested>(
      productFeatureActions.ActionTypes.TOGGLE_ACTIVE_REQUESTED
    ),
    switchMap(action => this.productService.toggleProductActive(action.payload.product)
      .pipe(
          tap(product => this.store$.dispatch(new productFeatureActions.UpdateProductRequested({product}))),
          map(product => new productFeatureActions.ToggleActiveComplete()),
          catchError(error => {
            return of(new productFeatureActions.LoadErrorDetected({ error }));
          })
        )
    ),
  );
}
