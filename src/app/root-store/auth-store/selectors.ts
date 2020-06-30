import {
  MemoizedSelector,
  createSelector,
  createFeatureSelector
} from '@ngrx/store';
import { State } from './state';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';

const getIsAuth = (state: State): boolean => state.isAuthenticated;

export const selectAuthState: MemoizedSelector<object, State>
= createFeatureSelector<State>(AdminFeatureNames.AUTH);

export const selectIsAuth: MemoizedSelector<object, boolean>
= createSelector(
  selectAuthState,
  getIsAuth
);
