import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as authFeatureActions from './actions';
import * as userFeatureActions from '../user-store/actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { RootStoreState } from '..';
import { StoreUserDataType } from 'src/app/core/models/user/store-user-data-type.model';
import { AuthenticateUserType } from 'src/app/core/models/auth/authenticate-user-type.model';

@Injectable()
export class AuthStoreEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  authenticationRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<authFeatureActions.AuthenticationRequested>(
      authFeatureActions.ActionTypes.AUTHENTICATION_REQUESTED
    ),
    switchMap(action => {

      // If email auth, retrieve additional user data from FB
      if (action.payload.requestType === AuthenticateUserType.EMAIL_AUTH) {
        return this.authService.loginWithEmail(action.payload.authData)
          .pipe(
            // Load user data into the store (skip info update that happens in Google login)
            tap(fbUser =>
              // If email login, payload is a firebaseUser, but all we need is the uid
              this.store$.dispatch(new userFeatureActions.UserDataRequested({userId: fbUser.uid}))
            ),
            map(fbUser => new authFeatureActions.AuthenticationComplete()),
            catchError(error => {
              return of(new authFeatureActions.LoadErrorDetected({ error }));
            })
          );
      }

      // If Google login, treat like user registration
      if (action.payload.requestType === AuthenticateUserType.GOOGLE_AUTH) {
       return this.authService.loginWithGoogle()
        .pipe(
          // Load user data into the store
          tap(userData => {
            // Add or update user info in database (will trigger a subsequent user store update request in User Store)
            return this.store$.dispatch(new userFeatureActions.StoreUserDataRequested({userData}));
          }),
          map(userCreds => new authFeatureActions.AuthenticationComplete()),
          catchError(error => {
            return of(new authFeatureActions.LoadErrorDetected({ error }));
          })
        );
      }

    })
  );

  @Effect()
  updateEmailRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<authFeatureActions.UpdateEmailRequested>(
      authFeatureActions.ActionTypes.UPDATE_EMAIL_REQUESTED
    ),
    switchMap(action =>
      this.authService.updateEmail(
        action.payload.appUser,
        action.payload.password,
        action.payload.newEmail
        )
        .pipe(
          // Update email in the main database (separate from the User database)
          tap(response => {
            return this.store$.dispatch(
              new userFeatureActions.StoreUserDataRequested(
                {userData: response.userData}
              )
            );
          }),
          map(response => new authFeatureActions.UpdateEmailComplete()),
          catchError(error => {
            return of(new authFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  updatePasswordRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<authFeatureActions.UpdatePasswordRequested>(
      authFeatureActions.ActionTypes.UPDATE_PASSWORD_REQUESTED
    ),
    switchMap(action =>
      this.authService.updatePassword(
        action.payload.appUser,
        action.payload.oldPassword,
        action.payload.newPassword
        )
        .pipe(
          map(response => new authFeatureActions.UpdatePasswordComplete()),
          catchError(error => {
            return of(new authFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  resetPasswordRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<authFeatureActions.ResetPasswordRequested>(
      authFeatureActions.ActionTypes.RESET_PASSWORD_REQUESTED
    ),
    switchMap(action =>
      this.authService.sendResetPasswordEmail(
        action.payload.email
        )
        .pipe(
          map(response => new authFeatureActions.ResetPasswordComplete()),
          catchError(error => {
            return of(new authFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );
}
