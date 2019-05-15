import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as userFeatureActions from './actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { RootStoreState } from '..';

@Injectable()
export class UserStoreEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  userDataRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.UserDataRequested>(
      userFeatureActions.ActionTypes.USER_DATA_REQUESTED
    ),
    switchMap(action =>
      this.userService.fetchUserData(action.payload.userId)
        .pipe(
          map(user => new userFeatureActions.UserDataLoaded({userData: user})),
          catchError(error => {
            return of(new userFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  storeUserDataRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.StoreUserDataRequested>(
      userFeatureActions.ActionTypes.STORE_USER_DATA_REQUESTED
    ),
    switchMap(action =>
      this.userService.storeUserData(action.payload.userData)
      .pipe(
        tap(userId => {
          // After data is stored, fetch it to update user data in local store for immediate UI updates
          this.store$.dispatch(
            new userFeatureActions.UserDataRequested({userId})
          );
        }),
        map(publicUser => new userFeatureActions.StoreUserDataComplete()),
        catchError(error => {
          return of(new userFeatureActions.LoadErrorDetected({ error }));
        })
      )
    )
  );

}
