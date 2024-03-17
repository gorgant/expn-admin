import { inject, signal } from '@angular/core';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, UrlTree } from '@angular/router';
import { Observable, combineLatest, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Store, select } from '@ngrx/store';
import { UiService } from '../services/ui.service';
import { FirebaseError } from '@angular/fire/app';
import { AuthStoreActions, UserStoreActions, UserStoreSelectors } from '../../root-store';
import { AdminUser } from '../../../../shared-models/user/admin-user.model';
import { AuthResultsData } from '../../../../shared-models/auth/auth-data.model';
import { AdminAppRoutes } from '../../../../shared-models/routes-and-paths/app-routes.model';

let loopProtectionCount = 0;

// Prevents logged in users from accessing the auth pages
// Fetch cached data if it exists, if so, fetch user db data, and either way process the routes accordingly
export const loginGuardCanActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const uiService = inject(UiService);
  const store$ = inject(Store);

  const authData$ = authService.fetchAuthData();
  const userData$ = store$.select(UserStoreSelectors.selectAdminUserData);

  const $fetchAdminUserSubmitted = signal(false);
  const fetchAdminUserError$ = store$.pipe(select(UserStoreSelectors.selectFetchAdminUserError)) as Observable<FirebaseError>;
  const fetchAdminUserProcessing$ = store$.pipe(select(UserStoreSelectors.selectFetchAdminUserProcessing));

  const resetComponentState = () => {
    $fetchAdminUserSubmitted.set(false);
    uiService.routeGuardProcessing = false;
  };

  const processUserRouting = (userData: AdminUser | null, authData: AuthResultsData | null): boolean => {
    const userLoggedIn = authData;

    // Permit user who isn't logged in to access auth page
    if (!userLoggedIn) {
      console.log('LoginGuard canActivate: no credentials present. Access to auth page permitted');
      resetComponentState();
      return true;
    }

    console.log('Auth credentials present and email verified in auth and db. Access to auth page denied. Routing to requested URL.');
    if (state.url === AdminAppRoutes.AUTH_LOGIN) {
      // This prevents an infinite loop if coming directly from clean login path
      router.navigate([AdminAppRoutes.HOME]);
    } else {
      // Otherwise pull the return url and route to that
      const returnUrl = route.queryParamMap.get('returnUrl') || '/';
      router.navigate([returnUrl]);
    }
    resetComponentState();
    return false;
  }

  console.log('LoginGuard canActivate activated');
  return fetchAdminUserError$
    .pipe(
      switchMap(processingError => {
        if (processingError) {
          console.log('processingError detected, terminating pipe', processingError);
          resetComponentState();
          store$.dispatch(AuthStoreActions.authGuardFailed({ error: processingError }));
          store$.dispatch(AuthStoreActions.logout());
        }
        return authData$;
      }),
      withLatestFrom(fetchAdminUserError$, userData$),
      // Don't filter for authData here since we want to handle a situation where it doesn't exist
      filter(([authData, processingError, userData]) => !processingError), // Halts function if processingError detected
      switchMap(([authData, processingError, userData]) => {
        uiService.routeGuardProcessing = true; // This is a setter for a signal to initiate a spinner
        if (authData && !userData && !$fetchAdminUserSubmitted()) {
          $fetchAdminUserSubmitted.set(true);
          console.log('No user data in store, fetching from database');
          store$.dispatch(UserStoreActions.fetchAdminUserRequested({ adminUserId: authData.id }));
        }
        return userData$;
      }),
      withLatestFrom(authData$, fetchAdminUserProcessing$,),
      filter(([userData, authData, fetchProcessing]) => !fetchProcessing),
      map(([userData, authData, fetchProcessing]) => {
        loopProtectionCount++;
        if (loopProtectionCount > 50) {
          console.log('Loop protection triggered');
          resetComponentState();
          throw Error('Loop protection triggered, halting function');
        }
        return processUserRouting(userData, authData);
      }),
      catchError(error => {
        console.log('Error in component:', error);
        uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
        resetComponentState();
        store$.dispatch(AuthStoreActions.authGuardFailed({ error }));
        store$.dispatch(AuthStoreActions.logout());
        return throwError(() => new Error(error));
      })
    );
}


