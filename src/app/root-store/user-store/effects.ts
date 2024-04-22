import { Injectable, inject } from "@angular/core";
import { FirebaseError } from "@angular/fire/app";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, concatMap, map, switchMap, take } from "rxjs/operators";
import * as UserStoreActions from './actions';
import { UserService } from "../../core/services/user.service";

@Injectable()
export class UserStoreEffects {
  
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  
  constructor() { }

  exportSubscribersEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(UserStoreActions.exportSubscribersRequested),
      switchMap(action => 
        this.userService.exportSubscribers(action.exportParams).pipe(
          map(exportDownloadUrl => {
            return UserStoreActions.exportSubscribersCompleted({exportDownloadUrl});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(UserStoreActions.exportSubscribersFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  fetchAdminUserEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(UserStoreActions.fetchAdminUserRequested),
      switchMap(action => 
        this.userService.fetchAdminUser(action.adminUserId).pipe(
          map(adminUser => {
            return UserStoreActions.fetchAdminUserCompleted({userData: adminUser});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(UserStoreActions.fetchAdminUserFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  processPublicUserImportDataEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(UserStoreActions.processPublicUserImportDataRequested),
      concatMap(action => 
        this.userService.processPublicUserImportData(action.publicUserImportMetadata).pipe(
          map(pubSubResponse => {
            return UserStoreActions.processPublicUserImportDataCompleted({pubSubResponse});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(UserStoreActions.processPublicUserImportDataFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  updateAdminUserEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(UserStoreActions.updateAdminUserRequested),
      concatMap(action => 
        this.userService.updateAdminUser(action.userUpdateData).pipe(
          map(updatedAdminUser => {
            return UserStoreActions.updateAdminUserCompleted({updatedUserData: updatedAdminUser});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(UserStoreActions.updateAdminUserFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  uploadPublicUserImportDataEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(UserStoreActions.uploadPublicUserImportDataRequested),
      concatMap(action => 
        this.userService.uploadPublicUserImportDataAndGetDownloadUrl(action.publicUserImportData).pipe(
          map(publicUserImportDataDownloadUrl => {
            return UserStoreActions.uploadPublicUserImportDataCompleted({publicUserImportDataDownloadUrl});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(UserStoreActions.uploadPublicUserImportDataFailed({error: fbError}));
          })
        )
      ),
    ),
  );

}