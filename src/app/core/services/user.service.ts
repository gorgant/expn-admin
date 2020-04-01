import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, takeUntil, catchError, take } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AdminUser } from 'shared-models/user/admin-user.model';
import { AdminCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private uiService: UiService
  ) { }

  fetchUserData(userId: string): Observable<AdminUser> {
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

  storeUserData(user: AdminUser | Partial<AdminUser>): Observable<string> {
    const userDoc = this.getUserDoc(user.id) as AngularFirestoreDocument<AdminUser | Partial<AdminUser>>;
    // Use set here because may be generating a new user or updating existing user
    const fbResponse = from(userDoc.set(user, {merge: true}));
    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('User data stored in database');
        return user.id;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error storing user data', error);
        return throwError(error);
      })
    );
  }

  // Provides easy access to user doc throughout the app
  getUserDoc(userId: string): AngularFirestoreDocument<AdminUser> {
    return this.getUserCollection().doc<AdminUser>(userId);
  }

  private getUserCollection(): AngularFirestoreCollection<AdminUser> {
    return this.db.collection<AdminUser>(AdminCollectionPaths.ADMIN_USERS);
  }

}
