import { Component, inject } from '@angular/core';
import { take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { MigrationService } from '../../core/services/migration.service';
import { GlobalFieldValues } from '../../../../shared-models/content/string-vals.model';
import { DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP, DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE } from '../../../../shared-models/user-interface/dialogue-box-default-config.model';
import { UiService } from '../../core/services/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportConfigDialogueComponent } from './export-config-dialogue/export-config-dialogue.component';
import { ImportPublicUsersComponent } from "./import-public-users/import-public-users.component";

@Component({
    selector: 'app-subscribers',
    standalone: true,
    templateUrl: './subscribers.component.html',
    styleUrl: './subscribers.component.scss',
    imports: [MatButtonModule, ImportPublicUsersComponent]
})
export class SubscribersComponent {

  EXPORT_PUBLIC_USERS_BUTTON_VALUE = GlobalFieldValues.EXPORT_PUBLIC_USERS;

  private store$ = inject(Store);
  private migrationService = inject(MigrationService);
  private uiService = inject(UiService);
  private dialog = inject(MatDialog);

  onExportSubscribers() {
    let dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE};
    if (!this.uiService.$screenIsMobile()) {
      dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP};
    }
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ExportConfigDialogueComponent, dialogConfig);

  }

  // onBackupPostCollection() {
  //   this.migrationService.backupPostCollection()
  //     .pipe(take(1))
  //     .subscribe();
  // }

  // onBackupPublicUserCollection() {
  //   this.migrationService.backupPublicUserCollection()
  //     .pipe(take(1))
  //     .subscribe();
  // }

  // onMigratePostData() {
  //   this.migrationService.migratePostData()
  //     .pipe(take(1))
  //     .subscribe();
  // }

  // onMigratePublicUserData() {
  //   this.migrationService.migratePublicUserData()
  //     .pipe(take(1))
  //     .subscribe();
  // }

}
