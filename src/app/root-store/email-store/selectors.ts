import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';

const getError = (state: State): any => state.error;
const getEmailSendProcessing = (state: State): boolean => state.emailSendProcessing;

export const selectEmailState: MemoizedSelector<object, State>
= createFeatureSelector<State>('email');

export const selectProductError: MemoizedSelector<object, any> = createSelector(
  selectEmailState,
  getError
);

export const selectEmailSendProcessing: MemoizedSelector<object, boolean>
= createSelector(selectEmailState, getEmailSendProcessing);
