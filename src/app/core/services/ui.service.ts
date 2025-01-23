import { Injectable, PLATFORM_ID, Signal, inject, signal } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { tap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT, Location, isPlatformBrowser } from '@angular/common';
import { SnackbarActions } from '../../../../shared-models/utils/snackbar-actions.model';
import { MatButton } from '@angular/material/button';
import { AdminAppRoutes } from '../../../../shared-models/routes-and-paths/app-routes.model';


@Injectable({
  providedIn: 'root'
})
export class UiService {

  private APP_VERSION = '3.0.6';

  $isServerPlatform = signal(false);

  private history: string[] = [];
  private $privateScreenIsMobile = signal(false);
  private window: Window | undefined;

  private $privateRouteGuardProcessing = signal(false); // Accessed by route guards to update UI loading symbol
  private $privateSideNavVisible = signal(false);
  private $privateNavItemsVisibile = signal(false);

  private snackbar = inject(MatSnackBar);
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private document = inject(DOCUMENT);
  private location = inject(Location);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.setPlatformType();
    this.monitorNavItemsVisibility();
    this.monitorScreenSize();
    this.monitorNavigationHistory();
    if (!this.$isServerPlatform()) {
      this.window = this.document.defaultView as Window;
    }
  }

  setPlatformType() {
    if(!isPlatformBrowser(this.platformId)) {
      this.$isServerPlatform.set(true);
    }
  }

  get appVersion() {
    return this.APP_VERSION;
  }

  configureAppCheck() {
    if (this.$isServerPlatform()) {
      console.log('Server platform detected, canceling configureAppCheck functionality');
      return;
    }
    // Enable the debug token if running in localhost
    if (location.hostname === "localhost") {
      console.log('local host detected, enabling appcheck debug token');
      (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
  }

  toggleSidenav($event?: MouseEvent, matButton?: MatButton) {
    this.$privateSideNavVisible.set(!this.$privateSideNavVisible());
  }

  get $sideNavVisible() {
    return this.$privateSideNavVisible.asReadonly();
  }

  private monitorNavItemsVisibility() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        if (currentUrl.includes(AdminAppRoutes.AUTH_LOGIN)) {
          this.$privateNavItemsVisibile.set(false);
        } else {
          this.$privateNavItemsVisibile.set(true);
        }
        console.log('Current URL:', currentUrl);
      }
    });
  }

  get $navItemsVisible() {
    return this.$privateNavItemsVisibile.asReadonly();
  }

  showSnackBar(message: string, duration: number, action: SnackbarActions = SnackbarActions.DISMISS) {
    const config = new MatSnackBarConfig();
    config.duration = duration;
    config.panelClass = ['custom-snack-bar']; // CSS managed in global styles.css

    const snackBarRef = this.snackbar.open(message, action, config);

    // Perform an action based on the action input
    snackBarRef.onAction().subscribe(() => {

      switch (action) {
        case SnackbarActions.DISMISS:
          snackBarRef.dismiss();
          break;
        default:
          snackBarRef.dismiss();
          break;
      }
    });
  }

  private monitorScreenSize() {
    this.breakpointObserver.observe(['(max-width: 959px)'])
      .pipe(
        tap((state: BreakpointState) => {
          if (state.matches) {
            console.log('Mobile screen detected');
            this.$privateScreenIsMobile.set(true);
          } else {
            console.log('Desktop screen detected');
            this.$privateScreenIsMobile.set(false);
          }
        })
      )
      .subscribe();

  }

  get screenWidth(): number | undefined {
    if (this.$isServerPlatform() || !this.window) {
      console.log('Server platform detected, canceling screenWidth functionality');
      return undefined;
    }
    return this.window.innerWidth;
  }

  get $screenIsMobile(): Signal<boolean> {
    return this.$privateScreenIsMobile.asReadonly();
  }

  // Used to avoid a back naviagation request when no navigation history available (e.g., user just loaded app)
  private monitorNavigationHistory() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  // Courtesy of https://nils-mehlhorn.de/posts/angular-navigate-back-previous-page
  routeUserToPreviousPage(): void {
    if (this.$isServerPlatform()) {
      console.log('Server platform detected, canceling routeUserToPreviousPage functionality');
      return;
    }
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  set routeGuardProcessing(isProcessing: boolean) {
    this.$privateRouteGuardProcessing.set(isProcessing);
  }

  get $routeGuardProcessing(): Signal<boolean> {
    return this.$privateRouteGuardProcessing.asReadonly();
  }
}
