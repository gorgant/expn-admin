import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as emailFeatureActions from './actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { RootStoreState } from '..';
import { EmailService } from 'src/app/core/services/email.service';


@Injectable()
export class EmailStoreEffects {
  constructor(
    private actions$: Actions,
    private emailService: EmailService,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  sendTestEmailEffect$: Observable<Action> = this.actions$.pipe(
    ofType<emailFeatureActions.SendTestEmailRequested>(emailFeatureActions.ActionTypes.SEND_TEST_EMAIL_REQUESTED),
    switchMap(action =>
      this.emailService.sendSendgridTest(action.payload.emailContent)
        .pipe(
          map(result => {
            if (!result) {
              throw new Error('No results from email test send, check for error');
            }
            return new emailFeatureActions.SendTestEmailComplete();
          }),
          catchError(error => {
            return of(new emailFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

}
