import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminAppRoutes, PublicAppRoutes } from '../../../../shared-models/routes-and-paths/app-routes.model';
import { UiService } from '../../core/services/ui.service';
import { SocialUrls } from '../../../../shared-models/meta/social-urls.model';
import { LegalBusinessNames } from '../../../../shared-models/meta/business-info.model';
import { DateTime } from 'luxon';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    imports: [RouterLink, DatePipe]
})
export class FooterComponent {

  APP_ROUTES = AdminAppRoutes;
  LEGAL_BUSINESS_NAME = LegalBusinessNames.EXPN;

  $showAppVersion = signal(false);
  currentDate = DateTime.now().toMillis();

  uiService = inject(UiService);

  toggleShowAppVersion() {
    this.$showAppVersion.set(!this.$showAppVersion());
  }

}
