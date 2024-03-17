import { Injectable, inject } from "@angular/core";
import { FirebaseError } from "@angular/fire/app";
import { catchError, concatMap, map, switchMap, tap } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import * as AuthStoreActions from "./actions";
import { AuthService } from "../../core/services/auth.service";

@Injectable()
export class AuthStoreEffects {

  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  constructor() { }

  confirmPasswordEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthStoreActions.confirmPasswordRequested),
      switchMap(action => 
        this.authService.confirmPassword(action.confirmPasswordData).pipe(
          map(passwordConfirmed => {
            return AuthStoreActions.confirmPasswordCompleted({passwordConfirmed});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(AuthStoreActions.confirmPasswordFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  detectCachedUserEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthStoreActions.detectCachedUserRequested),
      concatMap(action => 
        this.authService.fetchAuthData().pipe(
          map(authResultsData => {
            return AuthStoreActions.detectCachedUserCompleted({authResultsData});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(AuthStoreActions.detectCachedUserFailed({error: fbError}));
          })
        )
      )
    )
  );

  emailAuthEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthStoreActions.emailAuthRequested),
      switchMap(action => 
        this.authService.loginWithEmail(action.authData).pipe(
          map(authResultsData => {
            return AuthStoreActions.emailAuthCompleted({authResultsData});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(AuthStoreActions.emailAuthFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  logoutEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthStoreActions.logout),
      tap(action => {
        this.authService.logout();
      })
    ),
    {dispatch: false}
  );

  reloadAuthDataEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthStoreActions.reloadAuthDataRequested),
      switchMap(action => 
        this.authService.reloadAuthData().pipe(
          map(authResultsData => {
            return AuthStoreActions.reloadAuthDataCompleted({authResultsData});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(AuthStoreActions.reloadAuthDataFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  resetPasswordEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthStoreActions.resetPasswordRequested),
      concatMap(action => 
        this.authService.sendResetPasswordEmail(action.email).pipe(
          map(resetSubmitted => {
            return AuthStoreActions.resetPasswordCompleted({resetSubmitted});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(AuthStoreActions.resetPasswordFailed({error: fbError}));
          })
        )
      ),
    ),
  );

}
