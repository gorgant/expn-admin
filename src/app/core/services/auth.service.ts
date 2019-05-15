import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from '../models/auth/auth-data.model';
import { UiService } from 'src/app/core/services/ui.service';
import { AdminUser } from 'src/app/core/models/user/admin-user.model';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { from, Observable, Subject, throwError } from 'rxjs';
import { AppRoutes } from '../models/routes-and-paths/app-routes.model';
import { now } from 'moment';

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
    const authResponse = this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(creds => {
      const publicUser: AdminUser = {
        id: creds.user.uid,
        displayName: authData.name,
        email: authData.email,
        lastAuthenticated: now(),
        createdDate: now()
      };
      return publicUser;
    })
    .catch(error => {
      this.uiService.showSnackBar(error, null, 5000);
      return throwError(error).toPromise();
    });

    return from(authResponse);
  }

  // Currently, Google Login is not available (done with admin console)
  loginWithGoogle(): Observable<AdminUser> {
    const authResponse = this.afAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    ).then(creds => {
      const newUser = creds.additionalUserInfo.isNewUser; // Check if this is a new user
      const publicUser: AdminUser = {
        displayName: creds.user.displayName,
        email: creds.user.email,
        avatarUrl: creds.user.photoURL,
        id: creds.user.uid,
        isNewUser: newUser,
        lastAuthenticated: now()
      };
      if (newUser) {
        publicUser.createdDate = now();
      }
      return publicUser;
    })
    .catch(error => {
      this.uiService.showSnackBar(error, null, 5000);
      return throwError(error).toPromise();
    });

    return from(authResponse);
  }

  loginWithEmail(authData: AuthData): Observable<Partial<AdminUser>> {
    const authResponse = this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(creds => {
      // Create a partial user object to log last authenticated
      const partialUser: Partial<AdminUser> = {
        id: creds.user.uid,
        lastAuthenticated: now()
      };
      return partialUser;
    })
    .catch(error => {
      this.uiService.showSnackBar(error, null, 5000);
      return throwError(error).toPromise();
    });

    return from(authResponse);
  }

  logout(): void {
    this.preLogoutActions();
    this.afAuth.auth.signOut();
    // Post logout actions carried out by auth listener once logout detected
  }

  updateEmail(publicUser: AdminUser, password: string, newEmail: string): Observable<{userData: AdminUser, userId: string}> {

    const credentials = this.getUserCredentials(publicUser.email, password);

    const authResponse = this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials)
      .then(userCreds => {
        const updateResponse = this.afAuth.auth.currentUser.updateEmail(newEmail)
          .then(empty => {
            const newUserData: AdminUser = {
              ...publicUser,
              email: newEmail
            };
            this.uiService.showSnackBar(`Email successfully updated: ${newEmail}`, null, 3000);
            return {userData: newUserData, userId: publicUser.id};
          })
          .catch(error => {
            this.uiService.showSnackBar(error, null, 3000);
            return error;
          });
        return updateResponse;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 3000);
        return throwError(error).toPromise();
      });

    return from(authResponse);
  }

  updatePassword(publicUser: AdminUser, oldPassword: string, newPassword: string): Observable<string> {
    const credentials = this.getUserCredentials(publicUser.email, oldPassword);

    const authResponse = this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials)
      .then(userCreds => {
        const updateResponse = this.afAuth.auth.currentUser.updatePassword(newPassword)
          .then(empty => {
            this.uiService.showSnackBar(`Password successfully updated`, null, 3000);
            return 'success';
          })
          .catch(error => {
            this.uiService.showSnackBar(error, null, 3000);
            return error;
          });
        return updateResponse;
      })
      .catch(error => {
        this.uiService.showSnackBar(error, null, 3000);
        return throwError(error).toPromise();
      });

    return from(authResponse);
  }

  sendResetPasswordEmail(email: string): Observable<string> {
    const authResponse = this.afAuth.auth.sendPasswordResetEmail(email)
      .then(empty => {
        this.uiService.showSnackBar(
          `Password reset link sent to ${email}. Please check your email for instructions.`, null, 5000
        );
        return 'success';
      } )
      .catch(error => {
        this.uiService.showSnackBar(error, null, 5000);
        return throwError(error).toPromise();
      });

    return from(authResponse);
  }

  get unsubTrigger$() {
    return this.ngUnsubscribe$;
  }

  private getUserCredentials(email: string, password: string): firebase.auth.AuthCredential {
    const credentials = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );
    return credentials;
  }

  private authSuccessActions(user: firebase.User): void {
    this.authStatus.next(user.uid);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    if (returnUrl && returnUrl !== '/') {
      this.router.navigate([returnUrl]);
    } else {
      this.router.navigate([AppRoutes.HOME]);
    }
  }

  private preLogoutActions(): void {
    this.ngUnsubscribe$.next(); // Send signal to Firebase subscriptions to unsubscribe
    this.ngUnsubscribe$.complete(); // Send signal to Firebase subscriptions to unsubscribe
    // Reinitialize the unsubscribe subject in case page isn't refreshed after logout (which means auth wouldn't reset)
    this.ngUnsubscribe$ = new Subject<void>();
    this.router.navigate([AppRoutes.LOGIN]);
  }

  private postLogoutActions(): void {
    this.authStatus.next(null);
  }
}
