import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/core/services/ui.service';
import { AdminAppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthStoreActions, RootStoreState } from 'src/app/root-store';
import { Store } from '@ngrx/store';

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
