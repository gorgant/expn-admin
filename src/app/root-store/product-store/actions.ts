import { Action } from '@ngrx/store';
import { Product } from 'src/app/core/models/products/product.model';

export enum ActionTypes {
  SINGLE_PRODUCT_REQUESTED = '[Products] Single Product Requested',
  SINGLE_PRODUCT_LOADED = '[Products] Single Product Loaded',
  ALL_PRODUCTS_REQUESTED = '[Products] All Products Requested',
  ALL_PRODUCTS_LOADED = '[Products] All Products Loaded',
  PRODUCT_LOAD_FAILURE = '[Products] Load Failure',
}

export class SingleProductRequested implements Action {
  readonly type = ActionTypes.SINGLE_PRODUCT_REQUESTED;
  constructor(public payload: { productId: string }) {}
}

export class SingleProductLoaded implements Action {
  readonly type = ActionTypes.SINGLE_PRODUCT_LOADED;
  constructor(public payload: { product: Product }) {}
}

export class AllProductsRequested implements Action {
  readonly type = ActionTypes.ALL_PRODUCTS_REQUESTED;
}

export class AllProductsLoaded implements Action {
  readonly type = ActionTypes.ALL_PRODUCTS_LOADED;
  constructor(public payload: { products: Product[] }) {}
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.PRODUCT_LOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export type Actions =
  SingleProductRequested |
  SingleProductLoaded |
  AllProductsRequested |
  AllProductsLoaded |
  LoadErrorDetected
  ;
