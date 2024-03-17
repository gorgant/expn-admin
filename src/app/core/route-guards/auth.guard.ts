import { inject, signal } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment, CanActivateFn, UrlTree, CanMatchFn } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { switchMap, catchError, withLatestFrom, map, filter } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UiService } from '../services/ui.service';
import { AuthService } from '../services/auth.service';
import { FirebaseError } from '@angular/fire/app';
import { AdminAppRoutes } from '../../../../shared-models/routes-and-paths/app-routes.model';
import { AuthStoreActions, UserStoreActions, UserStoreSelectors } from '../../root-store';

// Collect segments and convert to a return url string
const covertSegmentsToReturnUrl = (segments: UrlSegment[]) => {
  const segmentArray = segments.map(segment => segment.path);
  const returnUrl = segmentArray.join('/');
  console.log('Produced this returnUrl', returnUrl);
  return returnUrl;
}

const redirectToLogin = (returnUrl: string, router: Router) => {
  // This if-statement prevents an infinite loop
  if (`/${returnUrl}` !== AdminAppRoutes.AUTH_LOGIN) {
    console.log('Redirecting to this returnUrl', returnUrl);
    router.navigate([AdminAppRoutes.AUTH_LOGIN], { queryParams: { returnUrl } });
  } else {
    console.log('Return url is already login!');
  }
}

let loopProtectionCount = 0;

const getAuthGuardResult = (returnUrl: string, guardType: 'canActivate' | 'canLoad') => {
  console.log(`Authguard ${guardType}: triggered`);
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

  // Prevents unauthorized users from accessing the app
  // Fetch cached data if it exists, if so, fetch user db data, and either way process the routes accordingly
  return fetchAdminUserError$
    .pipe(
      switchMap(processingError => {
        
        if (processingError) {
          console.log('processingError detected, terminating pipe', processingError);
          resetComponentState();
          store$.dispatch(AuthStoreActions.authGuardFailed({ error: processingError }));
          // store$.dispatch(AuthStoreActions.logout()); // Consider re-enabling if running into issues, disabled because it was causing unwanted logouts when idle
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

        const userLoggedIn = authData;

        // Redirect to login if no auth present
        if (!userLoggedIn) {
          console.log(`AuthGuard ${guardType}: user not authenticated, routing to login screen`);
          uiService.showSnackBar('Please login to continue.', 6000);
          redirectToLogin(returnUrl, router);
          resetComponentState();
          return false;
        }

        // Otherwise proceed
        console.log(`AuthGuard ${guardType}: auth present and email verified in both auth and db, proceeding with route request`);
        resetComponentState();
        return true;
      }),
      catchError(error => {
        console.log('Error in component:', error);
        uiService.showSnackBar(`AuthGuard ${guardType} error. Please refresh the page and try again.`, 10000);
        resetComponentState();
        store$.dispatch(AuthStoreActions.authGuardFailed({ error }));
        // store$.dispatch(AuthStoreActions.logout()); // Consider re-enabling if running into issues, disabled because it was causing unwanted logouts when idle
        return throwError(() => new Error(error));
      })
    );
} 

export const authGuardCanActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const returnUrl = state.url;
  return getAuthGuardResult(returnUrl, 'canActivate');
}

export const authGuardCanLoad: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  const returnUrl = covertSegmentsToReturnUrl(segments);
  return getAuthGuardResult(returnUrl, 'canLoad');
}
