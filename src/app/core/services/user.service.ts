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
    const userDoc = this.getUserDoc(userId);
    return userDoc
      .valueChanges()
      .pipe(
        // If logged out, this triggers unsub of this observable
        takeUntil(this.authService.unsubTrigger$),
        map(user => {
          console.log('Fetched user', user);
          return user;
        }),
        catchError(error => {
          console.log('Error fetching user', error);
          return throwError(error);
        })
      );
  }

  storeUserData(user: AppUser): Observable<string> {
    const userDoc = this.getUserDoc(user.id);
    // Use set here because may be generating a new user or updating existing user
    const fbResponse = userDoc.set(user, {merge: true})
      .then(res => {
        console.log('User data stored in database');
        return user.id;
      } )
      .catch(error => {
        console.log('Error storing data in database');
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
