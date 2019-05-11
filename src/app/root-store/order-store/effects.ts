import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as orderFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { OrderService } from 'src/app/core/services/order.service';

@Injectable()
export class OrderStoreEffects {
  constructor(
    private actions$: Actions,
    private orderService: OrderService
  ) { }

  @Effect()
  singleOrderRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<orderFeatureActions.SingleOrderRequested>(
      orderFeatureActions.ActionTypes.SINGLE_ORDER_REQUESTED
    ),
    mergeMap(action =>
      this.orderService.fetchSingleOrder(action.payload.orderId)
        .pipe(
          map(order => new orderFeatureActions.SingleOrderLoaded({ order })),
          catchError(error => {
            return of(new orderFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  allOrdersRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<orderFeatureActions.AllOrdersRequested>(
      orderFeatureActions.ActionTypes.ALL_ORDERS_REQUESTED
    ),
    switchMap(action =>
      this.orderService.fetchAllOrders()
        .pipe(
          map(orders => new orderFeatureActions.AllOrdersLoaded({ orders })),
          catchError(error => {
            return of(new orderFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

}
