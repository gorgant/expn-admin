import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState, signOut, signInWithEmailAndPassword, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, User, reload, deleteUser, AuthCredential } from '@angular/fire/auth';
import { UiService } from './ui.service';
import { from, Observable, Subject, throwError } from 'rxjs';
import { take, map, catchError, switchMap, takeUntil, filter, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AdminAppRoutes } from '../../../../shared-models/routes-and-paths/app-routes.model';
import { PasswordConfirmationData } from '../../../../shared-models/auth/password-confirmation-data.model';
import { AuthFormData, AuthResultsData } from '../../../../shared-models/auth/auth-data.model';
import { AuthStoreActions, PodcastEpisodeStoreActions, PostStoreActions, UserStoreActions } from '../../root-store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ngUnsubscribe$: Subject<void> = new Subject();
  
  private router = inject(Router);
  private uiService = inject(UiService);
  private auth = inject(Auth);
  private store$ = inject(Store);
  private authCheckInitialized = signal(false);

  constructor() {

    // If auth credentials are ever removed (eg. on a separate browser), immediately route user to login (disable for prod prelaunch mode)
    authState(this.auth)
      .subscribe(authState => {
        if (!authState && this.authCheckInitialized()) {
          console.log('Auth state auto logout initialized')
          this.router.navigate([AdminAppRoutes.AUTH_LOGIN]);
          this.logout();
        }
        this.authCheckInitialized.set(true); // prevents this logout from triggering on the initial load, which was canceling out the returnUrl param from the Authguard
      });
  }

  // Confirm User Password
  confirmPassword(passwordConfirmationData: PasswordConfirmationData): Observable<boolean> {

    const userCredentials = this.getUserCredentials(passwordConfirmationData.email, passwordConfirmationData.password);

    const authResponse = from(
      authState(this.auth).pipe(
        take(1),
        switchMap(authUser => {
          const reauthResults = reauthenticateWithCredential(authUser!, userCredentials);
          return reauthResults;
        }),
        map(reauthResults => {
          if (!reauthResults) {
            console.log('Password confirmation failed');
            throw new Error('Password confirmation failed');
          }
          console.log('Password confirmed');
          return true;
        }),
        catchError(error => {
          let errorMessage = error.message;
          if (errorMessage.includes('wrong-password')) {
            errorMessage = 'Invalid password. Please try again.';
          }
          this.uiService.showSnackBar(errorMessage, 10000);
          console.log('Error confirming password in auth', error);
          return throwError(() => new Error(error));
        })
      )
    );

    return authResponse;
  }

  // Detect cached user data
  fetchAuthData(): Observable<AuthResultsData | null> {
    return authState(this.auth)
      .pipe(
        takeUntil(this.unsubTrigger$),
        map(creds => {
          if (creds) {
            console.log('Fetched cached user data', creds);
            const authResultsData: AuthResultsData = {
              id: creds.uid,
              email: creds.email as string,
            }
            return authResultsData;
          }
          return null;
        }),
        shareReplay(),
      );
  }

  loginWithEmail(authData: AuthFormData): Observable<AuthResultsData> {

    const authResponse = from(
      signInWithEmailAndPassword(this.auth, authData.email, authData.password)
    );

    console.log('Submitting auth request to FB');

    return authResponse.pipe(
      take(1),
      map(creds => {
        // Create a partial user object to log last authenticated
        const authResultsData: AuthResultsData = {
          email: creds.user?.email as string,
          id: creds.user?.uid as string,
        };
        console.log('User authorized, returning partial user data', authResultsData);
        return authResultsData;
      }),
      catchError(error => {
        let errorMessage = error.message;
        if (errorMessage.includes('wrong-password') || errorMessage.includes('user-not-found')) {
          errorMessage = 'Invalid login credentials. Please try again.';
        }
        this.uiService.showSnackBar(errorMessage, 10000);
        console.log('Error authenticating user', error);
        return throwError(() => new Error(error));
      })
    );

  }

  logout(): void {
    this.preLogoutActions();
    
    signOut(this.auth);
  }

  reloadAuthData(): Observable<AuthResultsData> {
    const authResponse = from(
      authState(this.auth).pipe(
        filter(user => !!user),
        switchMap(user => {
          return reload(user!);
        }),
        switchMap(empty => {
          return authState(this.auth);
        }),
        filter(user => !!user),
        map(user => {
          console.log('Auth data reloaded', user);
          const authResultsData: AuthResultsData = {
            displayName: user?.displayName?.split(' ')[0] as string,
            email: user?.email as string,
            id: user?.uid as string
          };
          return authResultsData;
        }),
        shareReplay(),
        catchError(error => {
          this.uiService.showSnackBar(error.message, 10000);
          console.log('Error reloading auth data', error);
          return throwError(() => new Error(error));
        })
      )
    )

    return authResponse;
  }

  sendResetPasswordEmail(email: string): Observable<boolean> {
    const authResponse = from(
      sendPasswordResetEmail(this.auth, email)
    );

    return authResponse.pipe(
      take(1),
      map(creds => {
        this.uiService.showSnackBar(
          `Password reset link sent to ${email}. Please check your email for instructions.`, 10000
        );
        return true;
      }),
      catchError(error => {
        this.uiService.showSnackBar(error.message, 10000);
        console.log('Error sending reset password email', error);
        return throwError(() => new Error(error));
      })
    );
  }

  get unsubTrigger$() {
    return this.ngUnsubscribe$;
  }

  private getUserCredentials(email: string, password: string): AuthCredential {

    const credentials = EmailAuthProvider.credential(
      email,
      password
    );
    
    return credentials;
  }

  private preLogoutActions(): void {
    this.ngUnsubscribe$.next(); // Send signal to Firebase subscriptions to unsubscribe
    this.ngUnsubscribe$.complete(); // Send signal to Firebase subscriptions to unsubscribe
    this.ngUnsubscribe$ = new Subject<void>(); // Reinitialize the unsubscribe subject in case page isn't refreshed after logout (which means auth wouldn't reset)
    this.store$.dispatch(AuthStoreActions.purgeAuthState());
    this.store$.dispatch(PodcastEpisodeStoreActions.purgePodcastEpisodeState());
    this.store$.dispatch(PostStoreActions.purgePostState());
    this.store$.dispatch(UserStoreActions.purgeUserState());

  }

}
