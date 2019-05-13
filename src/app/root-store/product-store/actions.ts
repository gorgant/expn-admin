import { Action } from '@ngrx/store';
import { Product } from 'src/app/core/models/products/product.model';
import { Update } from '@ngrx/entity';

export enum ActionTypes {
  SINGLE_PRODUCT_REQUESTED = '[Products] Single Product Requested',
  SINGLE_PRODUCT_LOADED = '[Products] Single Product Loaded',
  ALL_PRODUCTS_REQUESTED = '[Products] All Products Requested',
  ALL_PRODUCTS_LOADED = '[Products] All Products Loaded',
  ADD_PRODUCT_REQUESTED = '[Products] Add Product Requested',
  ADD_PRODUCT_COMPLETE = '[Products] Add Product Complete',
  UPDATE_PRODUCT_REQUESTED = '[Products] Update Product Requested',
  UPDATE_PRODUCT_COMPLETE = '[Products] Update Product Complete',
  DELETE_PRODUCT_REQUESTED = '[Products] Delete Product Requested',
  DELETE_PRODUCT_COMPLETE = '[Products] Delete Product Complete',
  TOGGLE_ACTIVE_REQUESTED = '[Products] Toggle Product Active Requested',
  TOGGLE_ACTIVE_COMPLETE = '[Products] Toggle Product Active Complete',
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

export class AddProductRequested implements Action {
  readonly type = ActionTypes.ADD_PRODUCT_REQUESTED;

  constructor(public payload: { product: Product }) {}
}

export class AddProductComplete implements Action {
  readonly type = ActionTypes.ADD_PRODUCT_COMPLETE;

  constructor(public payload: { product: Product }) {}
}

export class UpdateProductRequested implements Action {
  readonly type = ActionTypes.UPDATE_PRODUCT_REQUESTED;

  constructor(public payload: { product: Product }) {}
}

export class UpdateProductComplete implements Action {
  readonly type = ActionTypes.UPDATE_PRODUCT_COMPLETE;

  constructor(public payload: { product: Update<Product> }) {}
}

export class DeleteProductRequested implements Action {
  readonly type = ActionTypes.DELETE_PRODUCT_REQUESTED;

  constructor(public payload: { productId: string }) {}
}

export class DeleteProductComplete implements Action {
  readonly type = ActionTypes.DELETE_PRODUCT_COMPLETE;

  constructor(public payload: {productId: string}) {}
}

export class ToggleActiveRequested implements Action {
  readonly type = ActionTypes.TOGGLE_ACTIVE_REQUESTED;

  constructor(public payload: { product: Product }) {}
}

export class ToggleActiveComplete implements Action {
  readonly type = ActionTypes.TOGGLE_ACTIVE_COMPLETE;
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
  AddProductRequested |
  AddProductComplete |
  UpdateProductRequested |
  UpdateProductComplete |
  DeleteProductRequested |
  DeleteProductComplete |
  ToggleActiveRequested |
  ToggleActiveComplete |
  LoadErrorDetected
  ;
