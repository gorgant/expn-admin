import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as subscriberFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap, concatMap, tap } from 'rxjs/operators';
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
    switchMap(action =>
      this.subscriberService.fetchSingleSubscriber(action.payload.subscriberId)
        .pipe(
          map(subscriber => {
            if (!subscriber) {
              throw new Error('Subscriber not found');
            }
            return new subscriberFeatureActions.SingleSubscriberLoaded({ subscriber });
          }),
          catchError(error => {
            return of(new subscriberFeatureActions.LoadFailed({ error }));
          })
        )
    )
  );

  @Effect()
  exportSubscribersEffect$: Observable<Action> = this.actions$.pipe(
    ofType<subscriberFeatureActions.ExportSubscribersRequested>(
      subscriberFeatureActions.ActionTypes.EXPORT_SUBSCRIBERS_REQUESTED
    ),
    concatMap(action => this.subscriberService.exportSubscribers(action.payload.exportParams)
      .pipe(
          map(downloadUrl => {
            if (!downloadUrl) {
              throw new Error('No download url retreived for subscriber export');
            }
            return new subscriberFeatureActions.ExportSubscribersComplete({downloadUrl})
          }),
          catchError(error => {
            return of(new subscriberFeatureActions.ExportSubscribersFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  subscriberCountRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<subscriberFeatureActions.SubscriberCountRequested>(
      subscriberFeatureActions.ActionTypes.SUBSCRIBER_COUNT_REQUESTED
    ),
    concatMap(action => this.subscriberService.fetchSubscriberCount()
      .pipe(
          map(subCountData => {
            if (!subCountData) {
              throw new Error('No subCountData retreived for subscriber count request');
            }
            return new subscriberFeatureActions.SubscriberCountLoaded({subCountData})
          }),
          catchError(error => {
            return of(new subscriberFeatureActions.SubscriberCountFailed({ error }));
          })
        )
    ),
  );

}
