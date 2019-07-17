import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/core/services/ui.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStoreActions, RootStoreState } from 'src/app/root-store';
import { Store } from '@ngrx/store';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  appRoutes = AdminAppRoutes;

  constructor(
    private uiService: UiService,
    private authService: AuthService,
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
  }

  onToggleSideNav() {
    this.uiService.dispatchSideNavClick();
  }

  onLogout() {
    this.authService.logout();
    this.store$.dispatch(new AuthStoreActions.SetUnauthenticated());
  }

}
