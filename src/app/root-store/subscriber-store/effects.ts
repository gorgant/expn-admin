import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import * as subscriberFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { SubscriberService } from 'src/app/core/services/subscriber.service';

@Injectable()
export class SubscriberStoreEffects {
  constructor(
    private actions$: Actions,
    private subscriberService: SubscriberService
  ) { }

  @Effect()
  singleSubscriberRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<subscriberFeatureActions.SingleSubscriberRequested>(
      subscriberFeatureActions.ActionTypes.SINGLE_SUBSCRIBER_REQUESTED
    ),
    mergeMap(action =>
      this.subscriberService.fetchSingleSubscriber(action.payload.subscriberId)
        .pipe(
          map(subscriber => {
            if (!subscriber) {
              throw new Error('Subscriber not found');
            }
            return new subscriberFeatureActions.SingleSubscriberLoaded({ subscriber });
          }),
          catchError(error => {
            return of(new subscriberFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  allSubscribersRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<subscriberFeatureActions.AllSubscribersRequested>(
      subscriberFeatureActions.ActionTypes.ALL_SUBSCRIBERS_REQUESTED
    ),
    switchMap(action =>
      this.subscriberService.fetchAllSubscribers()
        .pipe(
          map(subscribers => new subscriberFeatureActions.AllSubscribersLoaded({ subscribers })),
          catchError(error => {
            return of(new subscriberFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

}
