import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor(
    private uiService: UiService
  ) { }

  ngOnInit() {
  }

  onToggleSideNav() {
    this.uiService.dispatchSideNavClick();
  }

}
