import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminUser } from 'src/app/core/models/user/admin-user.model';

export const getError = (state: State): any => state.error;
export const getUserIsLoading = (state: State): boolean => state.isLoading;
export const getUserLoaded = (state: State): boolean => state.userLoaded;
export const getUser = (state: State): AdminUser => state.user;

export const selectUserState: MemoizedSelector<object, State>
= createFeatureSelector<State>('user');

export const selectUser: MemoizedSelector<object, AdminUser> = createSelector(
  selectUserState,
  getUser
);

export const selectUserIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getUserIsLoading);

export const selectUserLoaded: MemoizedSelector<object, boolean>
= createSelector(selectUserState, getUserLoaded);
