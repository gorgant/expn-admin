import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as authFeatureActions from './actions';
import * as userFeatureActions from '../user-store/actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { RootStoreState } from '..';
import { AuthenticateUserType } from 'shared-models/auth/authenticate-user-type.model';


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
            tap(partialUser => {
              if (!partialUser) {
                throw new Error('User data not found');
              }
              this.store$.dispatch(new userFeatureActions.StoreUserDataRequested({userData: partialUser}));
              // If email login, payload is a firebaseUser, but all we need is the uid
              // this.store$.dispatch(new userFeatureActions.UserDataRequested({userId: fbUser.uid}))
            }),
            map(partialUser => new authFeatureActions.AuthenticationComplete()),
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
            if (!userData) {
              throw new Error('User data not found');
            }
            // Add or update user info in database (will trigger a subsequent user store update request in User Store)
            this.store$.dispatch(new userFeatureActions.StoreUserDataRequested({userData}));
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
        action.payload.user,
        action.payload.password,
        action.payload.newEmail
        )
        .pipe(
          // Update email in the main database (separate from the User database)
          tap(response => {
            if (!response) {
              throw new Error('No response from updateEmail function');
            }
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
        action.payload.user,
        action.payload.oldPassword,
        action.payload.newPassword
        )
        .pipe(
          map(response => {
            if (!response) {
              throw new Error('No response from updatePassword function');
            }
            return new authFeatureActions.UpdatePasswordComplete();
          }),
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
          map(response => {
            if (!response) {
              throw new Error('No response from sendResetPasswordEmail function');
            }
            return new authFeatureActions.ResetPasswordComplete();
          }),
          catchError(error => {
            return of(new authFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );
}
