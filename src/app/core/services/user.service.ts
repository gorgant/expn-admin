import { Injectable, inject } from '@angular/core';
import { collection, doc, docData, DocumentReference, CollectionReference, Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallableData }  from '@angular/fire/functions';
import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take, takeUntil } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';
import { Timestamp } from '@angular/fire/firestore';
import { HelperService } from './helpers.service';
import { AdminUser, AdminUserKeys, GoogleCloudFunctionsAdminUser } from '../../../../shared-models/user/admin-user.model';
import { AdminUserUpdateData } from '../../../../shared-models/user/user-update.model';
import { AdminFunctionNames } from '../../../../shared-models/routes-and-paths/fb-function-names.model';
import { AdminCollectionPaths } from '../../../../shared-models/routes-and-paths/fb-collection-paths.model';
import { PublicUserExportRequestParams } from '../../../../shared-models/user/public-user-exports.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firestore = inject(Firestore);
  private functions = inject(Functions);
  private authService = inject(AuthService);
  private uiService = inject(UiService);
  private helperService = inject(HelperService);

  constructor() { }

  exportSubscribers(exportParams: PublicUserExportRequestParams): Observable<string> {
    console.log('exportSubscribers call registered');
    const exportSubscribersHttpCall: (exportParamsData: PublicUserExportRequestParams) => 
      Observable<string> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_EXPORT_PUBLIC_USERS);

    return exportSubscribersHttpCall(exportParams)
      .pipe(
        take(1),
        map(downloadUrl => {
          console.log(`Exported subscribers`, downloadUrl);
          return downloadUrl;
        }),
        catchError(error => {
          console.log('Error exporting subscribers', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  fetchAdminUser(adminUserId: string): Observable<AdminUser> {
    const adminUserDoc = docData(this.getAdminUserDoc(adminUserId));
    return adminUserDoc
      .pipe(
        // If logged out, this triggers unsub of this observable
        takeUntil(this.authService.unsubTrigger$),
        map(adminUser => {
          if (!adminUser) {
            throw new Error(`Error fetching adminUser with id: ${adminUserId}`, );
          }
          const formattedUser: AdminUser = {
            ...adminUser,
            createdTimestamp: (adminUser[AdminUserKeys.CREATED_TIMESTAMP] as Timestamp).toMillis(),
            lastAuthenticatedTimestamp: (adminUser.lastAuthenticatedTimestamp as Timestamp).toMillis(),
            lastModifiedTimestamp: (adminUser.lastModifiedTimestamp as Timestamp).toMillis(),
          };
          console.log(`Fetched single adminUser`, formattedUser);
          return formattedUser;
        }),
        shareReplay(),
        catchError(error => {
          console.log('Error fetching adminUser', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  updateAdminUser(adminUserUpdateData: AdminUserUpdateData): Observable<AdminUser> {
    console.log('updateAdminUser call registered');
    const updateAdminUserHttpCall: (adminUserUpdateData: AdminUserUpdateData) => 
      Observable<GoogleCloudFunctionsAdminUser> = httpsCallableData(this.functions, AdminFunctionNames.ON_CALL_UPDATE_ADMIN_USER);

    return updateAdminUserHttpCall(adminUserUpdateData)
      .pipe(
        take(1),
        map(updatedAdminUser => {
          // Timestamps from Google Cloud Functions are a static object, so they need to be converted differently
          const formattedUser: AdminUser = {
            ...updatedAdminUser,
            createdTimestamp: this.helperService.convertGoogleCloudTimestampToMs(updatedAdminUser[AdminUserKeys.CREATED_TIMESTAMP]),
            lastAuthenticatedTimestamp: this.helperService.convertGoogleCloudTimestampToMs(updatedAdminUser.lastAuthenticatedTimestamp),
            lastModifiedTimestamp: this.helperService.convertGoogleCloudTimestampToMs(updatedAdminUser.lastModifiedTimestamp),
          };
          console.log(`Updated single adminUser`, formattedUser);
          return formattedUser;
        }),
        catchError(error => {
          console.log('Error updating adminUser', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }

  private getAdminUserCollection(): CollectionReference<AdminUser> {
    return collection(this.firestore, AdminCollectionPaths.ADMIN_USERS) as CollectionReference<AdminUser>;
  }

  private getAdminUserDoc(adminUserId: string): DocumentReference<AdminUser> {
    return doc(this.getAdminUserCollection(), adminUserId);
  }

 
  
}


