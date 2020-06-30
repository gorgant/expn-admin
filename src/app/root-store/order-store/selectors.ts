import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromOrders from './reducer';
import { Order } from 'shared-models/orders/order.model';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';

const getIsLoading = (state: State): boolean => state.isLoading;
const getOrdersLoaded = (state: State): boolean => state.ordersLoaded;
const getError = (state: State): any => state.error;

export const selectOrderState: MemoizedSelector<object, State>
= createFeatureSelector<State>(AdminFeatureNames.ORDERS);

export const selectAllOrders: (state: object) => Order[] = createSelector(
  selectOrderState,
  fromOrders.selectAll
);

export const selectOrderById: (orderId: string) => MemoizedSelector<object, Order>
= (orderId: string) => createSelector(
  selectOrderState,
  orderState => orderState.entities[orderId]
);

export const selectOrderError: MemoizedSelector<object, any> = createSelector(
  selectOrderState,
  getError
);

export const selectOrderIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectOrderState, getIsLoading);

export const selectOrdersLoaded: MemoizedSelector<object, boolean>
= createSelector(selectOrderState, getOrdersLoaded);

