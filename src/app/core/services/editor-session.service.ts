import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { EditorSession, EditorSessionVars } from 'shared-models/editor-sessions/editor-session.model';
import { SharedCollectionPaths, AdminCollectionPaths, PublicCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';
import { now } from 'moment';
import { UserStoreActions, UserStoreSelectors, RootStoreState } from 'src/app/root-store';
import { withLatestFrom, takeUntil, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, interval } from 'rxjs';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { ActiveEditorSessionsDialogueComponent } from 'src/app/shared/components/active-editor-sessions-dialogue/active-editor-sessions-dialogue.component';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EditorSessionService {

  private editorSessionUnsubTrigger$: Subject<void> = new Subject();
  private localEditorSession: EditorSession;
  private autoDisconnect: boolean;
  private activeSessionDialogueRef: MatDialogRef<ActiveEditorSessionsDialogueComponent, any>;



  constructor(
    private store$: Store<RootStoreState.State>,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  createEditorSession(docId: string, docCollectionPath: SharedCollectionPaths | AdminCollectionPaths | PublicCollectionPaths) {
    const newEditorSession: EditorSession = {
      id: this.utilsService.generateRandomCharacterNoCaps(10),
      docId,
      docCollectionPath,
      active: true,
      activatedTimestamp: now(),
      lastModifiedTimestamp: now()
    };
    this.localEditorSession = newEditorSession;
    this.store$.dispatch(new UserStoreActions.CreateEditorSessionRequested({newEditorSession}));
    this.store$.select(UserStoreSelectors.selectIsCreatingServerEditorSession)
      .pipe(
        takeUntil(this.unsubTrigger$),
        withLatestFrom(this.store$.select(UserStoreSelectors.selectServerEditorSessionCreated))
      ).subscribe(([isCreatingServerEditorSession, serverSessionCreated]) => {
        if (serverSessionCreated) {
          console.log('Server editor session created, initiating monitor');
          this.monitorServerEditorSession(); // Wait until server editor session is created before monitoring it
          this.monitorActiveEditorSessions(); // Wait until server editor session is created before monitoring this
        }
      });
    this.monitorLocalTimeout();
  }

  updateEditorSession() {
    const editorSessionUpdate: EditorSession = {
      ...this.localEditorSession,
      lastModifiedTimestamp: now()
    };
    this.localEditorSession = editorSessionUpdate;
    this.store$.dispatch(new UserStoreActions.UpdateEditorSessionRequested({editorSessionUpdate}));
  }

  // Listen for disconnect requests from other clients
  private monitorServerEditorSession() {
    const sessionId = this.localEditorSession.id;

    this.store$.select(UserStoreSelectors.selectServerEditorSession)
      .pipe(
        takeUntil(this.unsubTrigger$),
        withLatestFrom(this.store$.select(UserStoreSelectors.selectIsLoadingServerEditorSession)),
      )
      .subscribe(([editorSession, isLoadingCurrentEditorSession]) => {
        // If no server editor session in store, load that from server
        if (!editorSession && !isLoadingCurrentEditorSession) {
          console.log('No server editor session in store, loading now');
          this.store$.dispatch(new UserStoreActions.LoadServerEditorSessionRequested({sessionId}));
        }
        // Navigate to blog if session marked not active on separate client
        if (editorSession && !editorSession.active) {
          console.log('Remote disconnect request detected');
          this.autoDisconnect = true;
          // Close dialogue ref if its up
          if (this.activeSessionDialogueRef) {
            this.activeSessionDialogueRef.close();
          }
          const redirectRoute = this.getRedirectRoute();
          this.router.navigate([redirectRoute]);
        }
      });
  }

  private getRedirectRoute(): AdminAppRoutes {
    switch (this.localEditorSession.docCollectionPath) {
      case SharedCollectionPaths.POSTS:
        return AdminAppRoutes.BLOG_DASHBOARD;
      case SharedCollectionPaths.PRODUCTS:
        return AdminAppRoutes.PRODUCT_DASHBOARD;
      default:
        return AdminAppRoutes.HOME;
    }
  }

  // Present user with an option to close other active sessions if they exist
  private monitorActiveEditorSessions() {
    this.store$.select(UserStoreSelectors.selectActiveEditorSessions)
      .pipe(
        takeUntil(this.unsubTrigger$),
        withLatestFrom(
          this.store$.select(UserStoreSelectors.selectIsLoadingActiveEditorSessions),
          this.store$.select(UserStoreSelectors.selectServerEditorSession)
        ),
      )
      .subscribe(([activeSessions, isLoadingActiveEditorSessions, serverEditorSession]) => {
        if (!activeSessions && !isLoadingActiveEditorSessions) {
          console.log('No active editor sessions in store, loading now');
          this.store$.dispatch(new UserStoreActions.LoadActiveEditorSessionsRequested({currentEditorSession: this.localEditorSession}));
        }
        if (activeSessions && this.filterActiveSessions(activeSessions).length > 0 && serverEditorSession && serverEditorSession.active) {
          console.log('Additional active sessions detected');
          const dialogConfig = new MatDialogConfig();
          if (this.activeSessionDialogueRef) {
            this.activeSessionDialogueRef.close();
          }
          this.activeSessionDialogueRef = this.dialog.open(ActiveEditorSessionsDialogueComponent, dialogConfig);

          this.activeSessionDialogueRef.afterClosed()
            .pipe(take(1))
            .subscribe(userConfirmed => {
              if (userConfirmed) {
                this.store$.dispatch(new UserStoreActions.DisconnectActiveEditorSessionsRequested({
                  currentEditorSession: this.localEditorSession,
                  activeEditorSessions: activeSessions
                }));
              }
            });
        }
      });
  }

  // Return an array of active sessions that need to be disconnected
  private filterActiveSessions(activeSessions: EditorSession[]): EditorSession[] {
    const validActiveSessions = activeSessions.filter(session => {
      const notLocalSession = session.id !== this.localEditorSession.id;
      // Filters improperly closed windows
      const timeSinceLastUpdate = now() - session.lastModifiedTimestamp;
      const editorIsRecent = timeSinceLastUpdate < EditorSessionVars.INACTIVE_TIMEOUT_LIMIT ? true : false;
      // Confirm session is active
      const isActive = session.active;
      return notLocalSession && editorIsRecent && isActive;
    });

    console.log('Found these valid active sessions', validActiveSessions);

    return validActiveSessions;
  }

  // Automatically closes the editing session after a certain period of time
  private monitorLocalTimeout() {
    const localTimeoutCheckInterval = EditorSessionVars.TIMEOUT_CHECK_INTERVAL; // Frequency with which to check local timeout
    interval(localTimeoutCheckInterval) // Time before client auto-disconnects
      .pipe(
        takeUntil(this.unsubTrigger$)
      )
      .subscribe(() => {
        const localInactiveTimeLimit = EditorSessionVars.INACTIVE_TIMEOUT_LIMIT;
        const timeSinceLastUpdate = now() - this.localEditorSession.lastModifiedTimestamp;
        console.log('monitoring local timeout, time since last update', timeSinceLastUpdate);
        if (timeSinceLastUpdate > localInactiveTimeLimit) {
          this.autoDisconnect = true;
          const redirectRoute = this.getRedirectRoute();
          this.router.navigate([redirectRoute]);
        }
      });
  }

  private purgeEditorSessionState() {
    this.store$.dispatch(new UserStoreActions.PurgeEditorSessionData());
    const sessionId = this.localEditorSession.id;
    this.store$.dispatch(new UserStoreActions.DeleteEditorSessionRequested({sessionId}));
  }

  // Trigger unsub triggers both in this service as well as the user service
  destroyComponentActions(): void {
    if (!this.localEditorSession) {
      console.log('No editor session active, no observables to unsubscribe');
      return;
    }
    this.editorSessionUnsubTrigger$.next(); // Send signal to Firebase subscriptions to unsubscribe
    this.editorSessionUnsubTrigger$.complete(); // Send signal to Firebase subscriptions to unsubscribe
    // Reinitialize the unsubscribe subject in case page isn't refreshed after logout (which means auth wouldn't reset)
    this.editorSessionUnsubTrigger$ = new Subject<void>();
    this.userService.unsubscribeEditorSessionObservables();
    this.purgeEditorSessionState();
    this.localEditorSession = undefined;
    this.autoDisconnect = false;
    this.activeSessionDialogueRef = undefined;
  }

  get unsubTrigger$() {
    return this.editorSessionUnsubTrigger$;
  }

  get autoDisconnectDetected() {
    return this.autoDisconnect;
  }
}
