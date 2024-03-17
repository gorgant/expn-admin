import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAppRoutes, PublicAppRoutes } from '../../../../shared-models/routes-and-paths/app-routes.model';
import { UiService } from '../../core/services/ui.service';
import { MatIconModule } from '@angular/material/icon';
import { WebsiteUrls } from '../../../../shared-models/meta/web-urls.model';
import { MatButtonModule } from '@angular/material/button';
import { GlobalFieldValues } from '../../../../shared-models/content/string-vals.model';


@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatListModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  APP_ROUTES = AdminAppRoutes;

  ACCOUNT_LINK_VALUE = GlobalFieldValues.ACCOUNT;
  BLOG_LINK_VALUE = GlobalFieldValues.BLOG;
  HOME_LINK_VALUE = GlobalFieldValues.HOME;
  SUBSCRIBERS_LINK_VALUE = GlobalFieldValues.SUBSCRIBERS;

  uiService = inject(UiService);

}
