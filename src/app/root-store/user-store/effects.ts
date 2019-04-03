import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as userFeatureActions from './actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { RootStoreState } from '..';
import { StoreUserDataType } from 'src/app/core/models/user/store-user-data-type.model';

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
      this.userService.storeUserData(
        action.payload.userData, action.payload.userId, action.payload.requestType
      )
      .pipe(
        tap(appUser => {
          // Update user data in store
          this.store$.dispatch(
            new userFeatureActions.UserDataRequested({userId: appUser.id})
          );
          // If new user registration (via email or Google), create demo timer
          // Important: use action.payload userData for isNewUser (vs appUser from storeUserData database request)
          // because after store in db request, isNewUser will be false)
          if (
            action.payload.requestType === StoreUserDataType.REGISTER_USER ||
            (action.payload.requestType === StoreUserDataType.GOOGLE_LOGIN && action.payload.userData.isNewUser)
            ) {
              // Any actions needed for new user should happen here
          }
        }),
        map(appUser => new userFeatureActions.StoreUserDataComplete()),
        catchError(error => {
          return of(new userFeatureActions.LoadErrorDetected({ error }));
        })
      )
    )
  );

}
