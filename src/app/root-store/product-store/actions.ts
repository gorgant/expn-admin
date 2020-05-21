import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Product } from 'shared-models/products/product.model';

export enum ActionTypes {
  SINGLE_PRODUCT_REQUESTED = '[Products] Single Product Requested',
  SINGLE_PRODUCT_LOADED = '[Products] Single Product Loaded',
  ALL_PRODUCTS_REQUESTED = '[Products] All Products Requested',
  ALL_PRODUCTS_LOADED = '[Products] All Products Loaded',
  UPDATE_PRODUCT_REQUESTED = '[Products] Update Product Requested',
  UPDATE_PRODUCT_COMPLETE = '[Products] Update Product Complete',
  ROLLBACK_PRODUCT_REQUESTED = '[Products] Rollback Product Requested',
  ROLLBACK_PRODUCT_COMPLETE = '[Products] Rollback Product Complete',
  DELETE_PRODUCT_REQUESTED = '[Products] Delete Product Requested',
  DELETE_PRODUCT_COMPLETE = '[Products] Delete Product Complete',
  TOGGLE_ACTIVE_REQUESTED = '[Products] Toggle Product Active Requested',
  TOGGLE_ACTIVE_COMPLETE = '[Products] Toggle Product Active Complete',
  LOAD_FAILED = '[Products] Load Failed',
  SAVE_FAILED = '[Products] Save Failed',
  DELETE_FAILED = '[Products] Delete Failed',
  PUBLIC_UPDATE_FAILED = '[Products] Public Update Failed'
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

export class UpdateProductRequested implements Action {
  readonly type = ActionTypes.UPDATE_PRODUCT_REQUESTED;

  constructor(public payload: { product: Product }) {}
}

export class UpdateProductComplete implements Action {
  readonly type = ActionTypes.UPDATE_PRODUCT_COMPLETE;

  constructor(public payload: { product: Product }) {}
}

export class RollbackProductRequested implements Action {
  readonly type = ActionTypes.ROLLBACK_PRODUCT_REQUESTED;

  constructor(public payload: { product: Product }) {}
}

export class RollbackProductComplete implements Action {
  readonly type = ActionTypes.ROLLBACK_PRODUCT_COMPLETE;

  constructor(public payload: { product: Product }) {}
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

export class LoadFailed implements Action {
  readonly type = ActionTypes.LOAD_FAILED;
  constructor(public payload: { error: string }) {}
}

export class SaveFailed implements Action {
  readonly type = ActionTypes.SAVE_FAILED;
  constructor(public payload: { error: string }) {}
}

export class DeleteFailed implements Action {
  readonly type = ActionTypes.DELETE_FAILED;
  constructor(public payload: { error: string }) {}
}

export class PublicUpdateFailed implements Action {
  readonly type = ActionTypes.PUBLIC_UPDATE_FAILED;
  constructor(public payload: { error: string }) {}
}

export type Actions =
  SingleProductRequested |
  SingleProductLoaded |
  AllProductsRequested |
  AllProductsLoaded |
  UpdateProductRequested |
  UpdateProductComplete |
  RollbackProductRequested |
  RollbackProductComplete |
  DeleteProductRequested |
  DeleteProductComplete |
  ToggleActiveRequested |
  ToggleActiveComplete |
  LoadFailed |
  SaveFailed |
  DeleteFailed |
  PublicUpdateFailed
  ;
