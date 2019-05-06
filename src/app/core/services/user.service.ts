import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, from, Subject, throwError } from 'rxjs';
import { AppUser } from '../models/user/app-user.model';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { UiService } from './ui.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/services/auth.service';
import { StoreUserDataType } from '../models/user/store-user-data-type.model';
import { FbCollectionPaths } from '../models/routes-and-paths/fb-collection-paths';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private uiService: UiService,
    private authService: AuthService,
  ) { }

  fetchUserData(userId: string): Observable<AppUser> {
    return this.db.doc<AppUser>(`users/${userId}`)
      .snapshotChanges()
      .pipe(
        // If logged out, this triggers unsub of this observable
        takeUntil(this.authService.unsubTrigger$),
        map(docSnapshot => {
          const appUser: AppUser = {
            id: docSnapshot.payload.id,
            ...docSnapshot.payload.data(),
          };
          console.log('user data retrieved', appUser);
          // Mark new user false bc at this point demo timer request should have already been fired
          if (appUser.isNewUser) {
            this.storeUserData(appUser, appUser.id, StoreUserDataType.TOGGLE_NEW_USER_OFF);
          }
          return appUser;
        }),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  storeUserData(appUser: AppUser, userId: string, requestType: StoreUserDataType): Observable<AppUser> {
    const userData: AppUser = appUser;
    if (requestType === StoreUserDataType.REGISTER_USER) {
      userData.id = userId;
    }
    if (requestType === StoreUserDataType.TOGGLE_NEW_USER_OFF) {
      userData.isNewUser = false;
    }
    const userCollection = this.db.collection<AppUser>('users');
    const fbResponse = userCollection.doc(userId).set(appUser, {merge: true})
      .then(() => {
        if (
          requestType !== StoreUserDataType.REGISTER_USER &&
          requestType !== StoreUserDataType.GOOGLE_LOGIN &&
          requestType !== StoreUserDataType.EMAIL_UPDATE &&
          requestType !== StoreUserDataType.TOGGLE_NEW_USER_OFF
        ) {
          this.uiService.showSnackBar('User info updated', null, 3000);
        }
        return appUser;
      } )
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });
    return from(fbResponse);
  }

  // Provides easy access to user doc throughout the app
  getUserDoc(userId: string): AngularFirestoreDocument<AppUser> {
    return this.getUserCollection().doc<AppUser>(userId);
  }

  private getUserCollection(): AngularFirestoreCollection<AppUser> {
    return this.db.collection<AppUser>(FbCollectionPaths.USERS);
  }

}
