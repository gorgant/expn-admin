import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/core/services/ui.service';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  appRouts = AppRoutes;

  constructor(
    private uiService: UiService
  ) { }

  ngOnInit() {
  }

  onToggleSideNav() {
    this.uiService.dispatchSideNavClick();
  }

}
