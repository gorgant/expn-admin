import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';

const getError = (state: State): any => state.error;
const getEmailSendProcessing = (state: State): boolean => state.emailSendProcessing;

export const selectEmailState: MemoizedSelector<object, State>
= createFeatureSelector<State>(AdminFeatureNames.EMAIL);

export const selectProductError: MemoizedSelector<object, any> = createSelector(
  selectEmailState,
  getError
);

export const selectEmailSendProcessing: MemoizedSelector<object, boolean>
= createSelector(selectEmailState, getEmailSendProcessing);
