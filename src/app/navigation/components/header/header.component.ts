import { Component, OnInit, ViewChild } from '@angular/core';
import { UiService } from 'src/app/core/services/ui.service';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors, AuthStoreActions } from 'src/app/root-store';
import { AuthService } from 'src/app/core/services/auth.service';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userAuth$: Observable<boolean>;

  @ViewChild('matButton') matButton;
  activeUrl$: Observable<string>;
  appRoutes = AdminAppRoutes;

  constructor(
    private authService: AuthService,
    private store$: Store<RootStoreState.State>,
    private uiService: UiService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.userAuth$ = this.store$.select(AuthStoreSelectors.selectIsAuth);

    // Used in template to determine which header content to show
    this.activeUrl$ = this.router.events.pipe(
      filter(event =>
        event instanceof NavigationEnd
      ),
      map(event => {
        return this.router.url;
      })
    );
  }



  // Open/close side nav
  onToggleSidenav() {
    this.uiService.dispatchSideNavClick();
    // Clears sticky focus bug on menu icon
    this.matButton._elementRef.nativeElement.blur();
  }

  onLogout() {
    this.authService.logout();
    this.store$.dispatch(new AuthStoreActions.SetUnauthenticated());
  }

}
