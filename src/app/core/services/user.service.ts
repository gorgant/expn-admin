import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, from, throwError, Subject } from 'rxjs';
import { map, takeUntil, catchError, take } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { AdminUser } from 'shared-models/user/admin-user.model';
import { AdminCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';
import { UiService } from './ui.service';
import { EditorSession, EditorSessionKeys } from 'shared-models/editor-sessions/editor-session.model';
import { EditorSessionService } from './editor-session.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private editorSessionUnsubTrigger$: Subject<void> = new Subject();

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    // private editorSessionService: EditorSessionService,
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

  fetchCurrentEditorSession(sessionId: string): Observable<EditorSession> {
    const editorSessionDoc = this.getEditorSessionDoc(sessionId);
    return editorSessionDoc
      .valueChanges()
      .pipe(
        // If logged out, this triggers unsub of this observable
        takeUntil(this.editorSessionUnsubTrigger$),
        map(editorSession => {
          console.log('Fetched editor session', editorSession);
          return editorSession;
        }),
        catchError(error => {
          console.log('Error fetching user', error);
          return throwError(error);
        })
      );
  }

  createEditorSession(newEditorSession: EditorSession): Observable<EditorSession> {
    const fbResponse = from(this.getEditorSessionDoc(newEditorSession.id).set(newEditorSession));
    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('Editor session created', newEditorSession);
        return newEditorSession;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error creating editor session', error);
        return throwError(error);
      })
    );
  }

  updateEditorSession(currentEditorSession: EditorSession | Partial<EditorSession>): Observable<EditorSession | Partial<EditorSession>> {
    const fbResponse = from(this.getEditorSessionDoc(currentEditorSession.id).update(currentEditorSession));
    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('Editor session updated', currentEditorSession);
        return currentEditorSession;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error updating editor session', error);
        return throwError(error);
      })
    );
  }

  deleteEditorSession(sessionId: string): Observable<string> {
    const fbResponse = from(this.getEditorSessionDoc(sessionId).delete());
    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('Editor session deleted', sessionId);
        return sessionId;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error deleting editor session', error);
        return throwError(error);
      })
    );
  }

  fetchActiveEditorSessions(editorSession: EditorSession): Observable<EditorSession[]> {
    const activeEditorSessions = this.getActiveEditorSessionsCollection(editorSession);
    return activeEditorSessions.valueChanges()
      .pipe(
        takeUntil(this.editorSessionUnsubTrigger$),
        map(editorSessions => {
          console.log('Fetched all active editor sessions', editorSessions);
          return editorSessions;
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          console.log('Error fetching all posts', error);
          return throwError(error);
        })
      );
  }

  // Loop through all active editor sessions and mark them inactive
  disconnectAllActiveEditorSessions(currentSession: EditorSession, activeEditorSessions: EditorSession[]): Observable<string> {
    const batch = this.db.firestore.batch();

    const sessionsToDeactivate: EditorSession[] = activeEditorSessions.filter(session => session.id !== currentSession.id);

    sessionsToDeactivate.forEach(session => {
      const sessionDocRef = this.db.firestore.collection(AdminCollectionPaths.EDITOR_SESSIONS).doc(session.id);
      const sessionUpdate: Partial<EditorSession> = {
        active: false
      };
      batch.update(sessionDocRef, sessionUpdate);
    });

    const fbResponse = from(batch.commit());
    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('All other active sessions disconnected');
        return 'Batch update succeeded';
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error disconnecting active editor sessions', error);
        return throwError(error);
      })
    );
  }

  unsubscribeEditorSessionObservables() {
    this.editorSessionUnsubTrigger$.next(); // Send signal to Firebase subscriptions to unsubscribe
    this.editorSessionUnsubTrigger$.complete(); // Send signal to Firebase subscriptions to unsubscribe
    // Reinitialize the unsubscribe subject in case page isn't refreshed after logout (which means auth wouldn't reset)
    this.editorSessionUnsubTrigger$ = new Subject<void>();
  }

  private getUserDoc(userId: string): AngularFirestoreDocument<AdminUser> {
    return this.getUserCollection().doc<AdminUser>(userId);
  }

  private getUserCollection(): AngularFirestoreCollection<AdminUser> {
    return this.db.collection<AdminUser>(AdminCollectionPaths.ADMIN_USERS);
  }

  private getEditorSessionDoc(sessionId: string): AngularFirestoreDocument<EditorSession> {
    return this.getEditorSessionCollection().doc<EditorSession>(sessionId);
  }

  private getEditorSessionCollection(): AngularFirestoreCollection<EditorSession> {
    return this.db.collection<EditorSession>(AdminCollectionPaths.EDITOR_SESSIONS);
  }

  // Get active editor sessions that match the doc paramters of the current editor session
  private getActiveEditorSessionsCollection(editorSession: EditorSession): AngularFirestoreCollection<EditorSession> {
    return this.db.collection<EditorSession>(AdminCollectionPaths.EDITOR_SESSIONS, ref =>
      ref
        .where(`${EditorSessionKeys.DOC_ID}`, '==', `${editorSession[EditorSessionKeys.DOC_ID]}`)
        .where(`${EditorSessionKeys.DOC_COLLECTION_PATH}`, '==', `${editorSession[EditorSessionKeys.DOC_COLLECTION_PATH]}`)
        .where(`${EditorSessionKeys.ACTIVE}`, '==', true)
      );
  }

}
