import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import * as userFeatureActions from './actions';
import { switchMap, map, catchError, tap, concatMap, takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { RootStoreState } from '..';
import { EditorSessionService } from 'src/app/core/services/editor-session.service';

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
          map(user => {
            if (!user) {
              throw new Error('User data not found');
            }
            return new userFeatureActions.UserDataLoaded({userData: user});
          }),
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
      this.userService.storeUserData(action.payload.userData)
      .pipe(
        tap(userId => {
          if (!userId) {
            throw new Error('User id not found');
          }
          // After data is stored, fetch it to update user data in local store for immediate UI updates
          this.store$.dispatch(
            new userFeatureActions.UserDataRequested({userId})
          );
        }),
        map(publicUser => new userFeatureActions.StoreUserDataComplete()),
        catchError(error => {
          return of(new userFeatureActions.LoadErrorDetected({ error }));
        })
      )
    )
  );

  @Effect()
  loadServerEditorSessionEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.LoadServerEditorSessionRequested>(
      userFeatureActions.ActionTypes.LOAD_SERVER_EDITOR_SESSION_REQUESTED
    ),
    switchMap(action =>
      this.userService.fetchCurrentEditorSession(action.payload.sessionId)
        .pipe(
          map(currentEditorSession => {
            if (!currentEditorSession) {
              throw new Error('Editor session not found');
            }
            return new userFeatureActions.LoadCurrentEditorSessionComplete({ currentEditorSession });
          }),
          catchError(error => {
            return of(new userFeatureActions.LoadCurrentEditorSessionFailed({ error }));
          })
        )
    )
  );

  @Effect()
  createEditorSessionEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.CreateEditorSessionRequested>(
      userFeatureActions.ActionTypes.CREATE_EDITOR_SESSION_REQUESTED
    ),
    concatMap(action => this.userService.createEditorSession(action.payload.newEditorSession)
      .pipe(
          map(newEditorSession => {
            if (!newEditorSession) {
              throw new Error('Error creating editor session');
            }
            return new userFeatureActions.CreateEditorSessionComplete();
          }),
          catchError(error => {
            return of(new userFeatureActions.CreateEditorSessionFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  updateEditorSessionEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.UpdateEditorSessionRequested>(
      userFeatureActions.ActionTypes.UPDATE_EDITOR_SESSION_REQUESTED
    ),
    concatMap(action => this.userService.updateEditorSession(action.payload.editorSessionUpdate)
      .pipe(
          map(editorSessionUpdate => {
            if (!editorSessionUpdate) {
              throw new Error('Error updating editor session');
            }
            return new userFeatureActions.UpdateEditorSessionComplete();
          }),
          catchError(error => {
            return of(new userFeatureActions.UpdateEditorSessionFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  deleteEditorSessionEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.DeleteEditorSessionRequested>(
      userFeatureActions.ActionTypes.DELETE_EDITOR_SESSION_REQUESTED
    ),
    concatMap(action => this.userService.deleteEditorSession(action.payload.sessionId)
      .pipe(
          map(sessionId => {
            if (!sessionId) {
              throw new Error('Error deleting editor session');
            }
            return new userFeatureActions.DeleteEditorSessionComplete({ sessionId });
          }),
          catchError(error => {
            return of(new userFeatureActions.DeleteEditorSessionFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  loadActiveEditorSessionsEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.LoadActiveEditorSessionsRequested>(
      userFeatureActions.ActionTypes.LOAD_ACTIVE_EDITOR_SESSIONS_REQUESTED
    ),
    concatMap(action => this.userService.fetchActiveEditorSessions(action.payload.currentEditorSession)
      .pipe(
          map(activeEditorSessions => {
            if (!activeEditorSessions) {
              throw new Error('Error fetching active editor sessions');
            }
            return new userFeatureActions.LoadActiveEditorSessionsComplete({ activeEditorSessions });
          }),
          catchError(error => {
            return of(new userFeatureActions.LoadActiveEditorSessionsFailed({ error }));
          })
        )
    ),
  );

  @Effect()
  disconnectActiveEditorSessionsEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userFeatureActions.DisconnectActiveEditorSessionsRequested>(
      userFeatureActions.ActionTypes.DISCONNECT_ACTIVE_EDITOR_SESSIONS_REQUESTED
    ),
    concatMap(action => this.userService.disconnectAllActiveEditorSessions(
      action.payload.currentEditorSession, action.payload.activeEditorSessions
    )
      .pipe(
          map(operationResponse => {
            if (!operationResponse) {
              throw new Error('Error disconnecting active editor sessions');
            }
            return new userFeatureActions.DisconnectActiveEditorSessionsComplete({ operationResponse });
          }),
          catchError(error => {
            return of(new userFeatureActions.DisconnectActiveEditorSessionsFailed({ error }));
          })
        )
    ),
  );

}
