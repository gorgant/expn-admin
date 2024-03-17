import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallableData } from '@angular/fire/functions';
import { UiService } from './ui.service';
import { Observable, catchError, map, take, throwError } from 'rxjs';
import { AdminFunctionNames } from '../../../../shared-models/routes-and-paths/fb-function-names.model';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {

  private functions = inject(Functions);
  private uiService = inject(UiService);

  constructor() { }
  
  backupPostCollection(): Observable<void> {
    console.log('backupPostCollection call registered');
    const backupPostHttpCall: () => 
      Observable<void> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_BACKUP_POST_COLLECTION);

    return backupPostHttpCall()
      .pipe(
        take(1),
        map(empty => {
          console.log(`Post collection backup complete`, );
          return ;
        }),
        catchError(error => {
          console.log('Error backing up post collection', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  backupPublicUserCollection(): Observable<void> {
    console.log('backupPublicUserCollection call registered');
    const backupPublicUserHttpCall: () => 
      Observable<void> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_BACKUP_PUBLIC_USER_COLLECTION);

    return backupPublicUserHttpCall()
      .pipe(
        take(1),
        map(empty => {
          console.log(`PublicUser collection backup complete`, );
          return ;
        }),
        catchError(error => {
          console.log('Error backing up post collection', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  migratePostData(): Observable<void> {
    console.log('migratePostData call registered');
    const migratePostHttpCall: () => 
      Observable<void> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_MIGRATE_POST_DATA);

    return migratePostHttpCall()
      .pipe(
        take(1),
        map(empty => {
          console.log(`Post migration complete`, );
          return ;
        }),
        catchError(error => {
          console.log('Error with post migration', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  migratePublicUserData(): Observable<void> {
    console.log('migratePublicUserData call registered');
    const migratePublicUserHttpCall: () => 
      Observable<void> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_MIGRATE_PUBLIC_USER_DATA);

    return migratePublicUserHttpCall()
      .pipe(
        take(1),
        map(empty => {
          console.log(`PublicUser migration complete`, );
          return ;
        }),
        catchError(error => {
          console.log('Error with post migration', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }
}
