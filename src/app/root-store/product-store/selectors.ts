import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProducts from './reducer';
import { Product } from 'src/app/core/models/products/product.model';

const getError = (state: State): any => state.error;
const getIsLoading = (state: State): boolean => state.isLoading;
const getProductsLoaded = (state: State): boolean => state.productsLoaded;
const getDeletionProcessing = (state: State): boolean => state.deletionProcessing;

export const selectProductState: MemoizedSelector<object, State>
= createFeatureSelector<State>('products');

export const selectAllProducts: (state: object) => Product[] = createSelector(
  selectProductState,
  fromProducts.selectAll
);

export const selectProductById: (productId: string) => MemoizedSelector<object, Product>
= (productId: string) => createSelector(
  selectProductState,
  productState => productState.entities[productId]
);

export const selectProductError: MemoizedSelector<object, any> = createSelector(
  selectProductState,
  getError
);

export const selectProductIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectProductState, getIsLoading);

export const selectProductsLoaded: MemoizedSelector<object, boolean>
= createSelector(selectProductState, getProductsLoaded);

export const selectDeletionProcessing: MemoizedSelector<object, boolean>
= createSelector(selectProductState, getDeletionProcessing);
