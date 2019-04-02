import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as userFeatureActions from './actions';
import { switchMap, map, catchError, tap, take } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { RootStoreState } from '..';
import { AppUser } from 'src/app/core/models/app-user.model';
import { StoreUserDataType } from 'src/app/core/models/store-user-data-type.model';

@Injectable()
export class UserStoreEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private store$: Store<RootStoreState.State>,
  ) { }

  @Effect()
  userDataRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.UserDataRequested>(
      userFeatureActions.ActionTypes.USER_DATA_REQUESTED
    ),
    switchMap(action =>
      this.userService.fetchUserData(action.payload.userId)
        .pipe(
          map(user => new userFeatureActions.UserDataLoaded({userData: user})),
          catchError(error => {
            return of(new userFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  storeUserDataRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.StoreUserDataRequested>(
      userFeatureActions.ActionTypes.STORE_USER_DATA_REQUESTED
    ),
    switchMap(action =>
      this.userService.storeUserData(
        action.payload.userData, action.payload.userId, action.payload.requestType
      )
      .pipe(
        tap(appUser => {
          // Update user data in store
          this.store$.dispatch(
            new userFeatureActions.UserDataRequested({userId: appUser.id})
          );
          // If new user registration (via email or Google), create demo timer
          // Important: use action.payload userData for isNewUser (vs appUser from storeUserData database request)
          // because after store in db request, isNewUser will be false)
          if (
            action.payload.requestType === StoreUserDataType.REGISTER_USER ||
            (action.payload.requestType === StoreUserDataType.GOOGLE_LOGIN && action.payload.userData.isNewUser)
            ) {
              // Any actions needed for new user should happen here
          }
        }),
        map(appUser => new userFeatureActions.StoreUserDataComplete()),
        catchError(error => {
          return of(new userFeatureActions.LoadErrorDetected({ error }));
        })
      )
    )
  );

  @Effect()
  updateProfileImageRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.UpdateProfileImageRequested>(
      userFeatureActions.ActionTypes.UPDATE_PROFILE_IMAGE_REQUESTED
    ),
    switchMap(action =>
      this.userService.uploadProfileImage(action.payload.imageFile, action.payload.user)
        .pipe(
          tap(emptySubject => {
            // Fetch the latest download URL (which isn't what comes from the initial upload)
            this.userService.fetchDownloadUrl(action.payload.user)
              .pipe(take(1))
              .subscribe(newImgUrl => {
                const updatedAppUser: AppUser = {
                  ...action.payload.user,
                  avatarUrl: newImgUrl
                };
                this.store$.dispatch(new userFeatureActions.StoreUserDataRequested({userData: updatedAppUser, userId: updatedAppUser.id}));
              });
          }),
          map(imageUrl => new userFeatureActions.UpdateProfileImageComplete()),
          catchError(error => {
            return of(new userFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

}
