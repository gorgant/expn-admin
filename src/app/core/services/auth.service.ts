import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UiService } from 'src/app/core/services/ui.service';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { from, Observable, Subject, throwError, combineLatest, of } from 'rxjs';
import { now } from 'moment';
import { AuthData } from 'shared-models/auth/auth-data.model';
import { AdminUser } from 'shared-models/user/admin-user.model';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { take, map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authStatus = new Subject<string>();
  private ngUnsubscribe$: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private uiService: UiService,
    private route: ActivatedRoute,
  ) { }

  // Listen for user, if exists, initiatle auth success actions, otherwise initiate logout actions
  initAuthListener(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authSuccessActions(user);
      } else {
        this.postLogoutActions();
      }
    });
  }

  // Currently, registration is not available (done with admin console)
  registerUser(authData: AuthData): Observable<AdminUser> {

    const authResponse = from(this.afAuth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ));

    return authResponse.pipe(
      take(1),
      map(creds => {
        const adminUser: AdminUser = {
          id: creds.user.uid,
          displayName: authData.name,
          email: authData.email,
          lastAuthenticated: now(),
          createdDate: now()
        };
        console.log('Public user registered', adminUser);
        return adminUser;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error registering user', error);
        return throwError(error);
      })
    );
  }

  // Currently, Google Login is not available (done with admin console)
  loginWithGoogle(): Observable<AdminUser> {

    const authResponse = from(this.afAuth.signInWithPopup(
      new firebase.default.auth.GoogleAuthProvider()
    ));

    return authResponse.pipe(
      take(1),
      map(creds => {
        const newUser = creds.additionalUserInfo.isNewUser; // Check if this is a new user
        const adminUser: AdminUser = {
          displayName: creds.user.displayName,
          email: creds.user.email,
          avatarUrl: creds.user.photoURL,
          id: creds.user.uid,
          isNewUser: newUser,
          lastAuthenticated: now()
        };
        if (newUser) {
          adminUser.createdDate = now();
        }
        return adminUser;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error registering user', error);
        return throwError(error);
      })
    );
  }

  loginWithEmail(authData: AuthData): Observable<Partial<AdminUser>> {

    const authResponse = from(this.afAuth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ));

    return authResponse.pipe(
      take(1),
      map(creds => {
        // Create a partial user object to log last authenticated
        const partialUser: Partial<AdminUser> = {
          id: creds.user.uid,
          lastAuthenticated: now()
        };
        return partialUser;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error registering user', error);
        return throwError(error);
      })
    );

  }

  logout(): void {
    this.preLogoutActions();
    this.afAuth.signOut();
    // Post logout actions carried out by auth listener once logout detected
  }

  updateEmail(publicUser: AdminUser, password: string, newEmail: string): Observable<{userData: AdminUser, userId: string}> {

    const credentials = this.getUserCredentials(publicUser.email, password);

    return from(this.afAuth.currentUser)
      .pipe(
        take(1),
        switchMap(user => {
          return combineLatest(of(user), from(user.reauthenticateAndRetrieveDataWithCredential(credentials)));
        }),
        switchMap(([user, userCreds]) => {
          return user.updateEmail(newEmail);
        }),
        map(empt => {
          const newUserData: AdminUser = {
            ...publicUser,
            email: newEmail
          };
          this.uiService.showSnackBar(`Email successfully updated: ${newEmail}`, 5000);
          return {userData: newUserData, userId: publicUser.id};
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          console.log('Error updating email', error);
          return throwError(error);
        })
      );
  }

  updatePassword(publicUser: AdminUser, oldPassword: string, newPassword: string): Observable<string> {
    const credentials = this.getUserCredentials(publicUser.email, oldPassword);

    return from(this.afAuth.currentUser)
      .pipe(
        take(1),
        switchMap(user => {
          return combineLatest(of(user), from(user.reauthenticateAndRetrieveDataWithCredential(credentials)));
        }),
        switchMap(([user, userCreds]) => {
          return user.updatePassword(newPassword);
        }),
        map(empt => {
          this.uiService.showSnackBar(`Password successfully updated`, 5000);
          return 'success';
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          console.log('Error updating password', error);
          return throwError(error);
        })
      );
  }

  sendResetPasswordEmail(email: string): Observable<string> {

    const authResponse = from(this.afAuth.sendPasswordResetEmail(email));

    return authResponse.pipe(
      take(1),
      map(creds => {
        this.uiService.showSnackBar(
          `Password reset link sent to ${email}. Please check your email for instructions.`, 10000
        );
        return 'success';
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error sending reset password email', error);
        return throwError(error);
      })
    );
  }

  get unsubTrigger$() {
    return this.ngUnsubscribe$;
  }

  private getUserCredentials(email: string, password: string): firebase.default.auth.AuthCredential {
    const credentials = firebase.default.auth.EmailAuthProvider.credential(
      email,
      password
    );
    return credentials;
  }

  private authSuccessActions(user: firebase.default.User): void {
    this.authStatus.next(user.uid);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    if (returnUrl && returnUrl !== '/') {
      this.router.navigate([returnUrl]);
    } else {
      this.router.navigate([AdminAppRoutes.HOME]);
    }
  }

  private preLogoutActions(): void {
    this.ngUnsubscribe$.next(); // Send signal to Firebase subscriptions to unsubscribe
    this.ngUnsubscribe$.complete(); // Send signal to Firebase subscriptions to unsubscribe
    // Reinitialize the unsubscribe subject in case page isn't refreshed after logout (which means auth wouldn't reset)
    this.ngUnsubscribe$ = new Subject<void>();
    this.router.navigate([AdminAppRoutes.LOGIN]);
  }

  private postLogoutActions(): void {
    this.authStatus.next(null);
  }
}
