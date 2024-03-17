import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminAppRoutes } from '../../../../shared-models/routes-and-paths/app-routes.model';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UiService } from '../../core/services/ui.service';
import { GlobalFieldValues } from '../../../../shared-models/content/string-vals.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RouterLink, MatButtonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  APP_ROUTES = AdminAppRoutes;
  
  ACCOUNT_LINK_VALUE = GlobalFieldValues.ACCOUNT;
  ADMIN_TITLE = GlobalFieldValues.ADMIN;
  BLOG_LINK_VALUE = GlobalFieldValues.BLOG;
  HOME_LINK_VALUE = GlobalFieldValues.HOME;
  SUBSCRIBERS_LINK_VALUE = GlobalFieldValues.SUBSCRIBERS;

  uiService = inject(UiService);
  route = inject(ActivatedRoute)

}
