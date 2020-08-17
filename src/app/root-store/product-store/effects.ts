import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as productFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap, tap, concatMap } from 'rxjs/operators';
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
    switchMap(action =>
      this.productService.fetchSingleProduct(action.payload.productId)
        .pipe(
          map(product => {
            if (!product) {
              throw new Error('Product not found');
            }
            return new productFeatureActions.SingleProductLoaded({ product });
          }),
          catchError(error => {
            return of(new productFeatureActions.LoadFailed({ error }));
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
          map(products => {
            if (!products) {
              throw new Error('Products not found');
            }
            return new productFeatureActions.AllProductsLoaded({ products });
          }),
          catchError(error => {
            return of(new productFeatureActions.LoadFailed({ error }));
          })
        )
    )
  );

  @Effect()
  deleteProductEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.DeleteProductRequested>(
      productFeatureActions.ActionTypes.DELETE_PRODUCT_REQUESTED
    ),
    concatMap(action => this.productService.deleteProduct(action.payload.productId)
      .pipe(
          map(productId => {
            if (!productId) {
              throw new Error('Error deleting product');
            }
            return new productFeatureActions.DeleteProductComplete({productId});
          }),
          catchError(error => {
            return of(new productFeatureActions.DeleteFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  updateProductEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.UpdateProductRequested>(
      productFeatureActions.ActionTypes.UPDATE_PRODUCT_REQUESTED
    ),
    concatMap(action => this.productService.updateProduct(action.payload.product)
      .pipe(
          map(product => {
            if (!product) {
              throw new Error('Error updating product');
            }
            return new productFeatureActions.UpdateProductComplete({ product });
          }),
          catchError(error => {
            return of(new productFeatureActions.SaveFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  rollbackProductEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.RollbackProductRequested>(
      productFeatureActions.ActionTypes.ROLLBACK_PRODUCT_REQUESTED
    ),
    concatMap(action => this.productService.rollbackProduct(action.payload.product)
      .pipe(
          map(product => {
            if (!product) {
              throw new Error('Error rolling back product');
            }
            return new productFeatureActions.RollbackProductComplete({ product });
          }),
          catchError(error => {
            return of(new productFeatureActions.SaveFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  toggleActiveEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.ToggleActiveRequested>(
      productFeatureActions.ActionTypes.TOGGLE_ACTIVE_REQUESTED
    ),
    concatMap(action => this.productService.toggleProductActive(action.payload.product)
      .pipe(
          // Update product locally once server update confirmed
          tap(product => {
            if (!product) {
              throw new Error('Error toggling product active');
            }
            return this.store$.dispatch(new productFeatureActions.UpdateProductRequested({product}));
          }),
          map(product => new productFeatureActions.ToggleActiveComplete()),
          catchError(error => {
            return of(new productFeatureActions.PublicUpdateFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  cloneProductEffect$: Observable<Action> = this.actions$.pipe(
    ofType<productFeatureActions.CloneProductRequested>(
      productFeatureActions.ActionTypes.CLONE_PRODUCT_REQUESTED
    ),
    concatMap(action => this.productService.cloneProductonAltAdmin(action.payload.product)
      .pipe(
          map(product => {
            if (!product) {
              throw new Error('Error cloning product');
            }
            return new productFeatureActions.ToggleActiveComplete();
          }),
          catchError(error => {
            return of(new productFeatureActions.PublicUpdateFailed({ error }));
          })
        )
    ),
  );
}
