import { Component, inject } from '@angular/core';
import { take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { MigrationService } from '../../core/services/migration.service';

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [ MatButtonModule ],
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent {

  store$ = inject(Store);
  migrationService = inject(MigrationService);

  onBackupPostCollection() {
    this.migrationService.backupPostCollection()
      .pipe(take(1))
      .subscribe();
  }

  onBackupPublicUserCollection() {
    this.migrationService.backupPublicUserCollection()
      .pipe(take(1))
      .subscribe();
  }

  onMigratePostData() {
    this.migrationService.migratePostData()
      .pipe(take(1))
      .subscribe();
  }

  onMigratePublicUserData() {
    this.migrationService.migratePublicUserData()
      .pipe(take(1))
      .subscribe();
  }

}
