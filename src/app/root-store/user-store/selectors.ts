import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminUser } from 'shared-models/user/admin-user.model';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';
import { EditorSession } from 'shared-models/editor-sessions/editor-session.model';

const getError = (state: State): any => state.error;
const getUserIsLoading = (state: State): boolean => state.isLoading;
const getUserLoaded = (state: State): boolean => state.userLoaded;
const getUser = (state: State): AdminUser => state.user;
const getIsCreatingServerEditorSession = (state: State): boolean => state.isCreatingEditorSession;
const getServerEditorSessionCreated = (state: State): boolean => state.serverEditorSessionCreated;
const getServerEditorSession = (state: State): EditorSession => state.serverEditorSession;
const getIsLoadingServerEditorSession = (state: State): boolean => state.isLoadingServerEditorSession;
const getActiveEditorSessions = (state: State): EditorSession[] => state.activeEditorSessions;
const getActiveEditorSessionsLoaded = (state: State): boolean => state.activeEditorSessionsLoaded;
const getIsLoadingActiveEditorSessions = (state: State): boolean => state.isLoadingActiveEditorSessions;

export const selectUserState: MemoizedSelector<object, State>
= createFeatureSelector<State>(AdminFeatureNames.USER);

export const selectUser: MemoizedSelector<object, AdminUser> = createSelector(selectUserState, getUser);

export const selectUserIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getUserIsLoading);

export const selectUserLoaded: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getUserLoaded);

export const selectIsLoadingServerEditorSession: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getIsLoadingServerEditorSession);

export const selectServerEditorSessionCreated: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getServerEditorSessionCreated);

export const selectServerEditorSession: MemoizedSelector<object, EditorSession> = createSelector(selectUserState, getServerEditorSession);

export const selectIsCreatingServerEditorSession: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getIsCreatingServerEditorSession);

export const selectActiveEditorSessions: MemoizedSelector<object, EditorSession[]>
= createSelector(selectUserState, getActiveEditorSessions);


export const selectIsLoadingActiveEditorSessions: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getIsLoadingActiveEditorSessions);

export const selectActiveEditorSessionsLoaded: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getActiveEditorSessionsLoaded);
