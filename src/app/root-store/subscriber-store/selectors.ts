import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSubscribers from './reducer';
import { EmailSubscriber } from 'src/app/core/models/subscribers/email-subscriber.model';

const getIsLoading = (state: State): boolean => state.isLoading;
const getSubscribersLoaded = (state: State): boolean => state.subscribersLoaded;
const getError = (state: State): any => state.error;

export const selectSubscriberState: MemoizedSelector<object, State>
= createFeatureSelector<State>('subscribers');

export const selectAllSubscribers: (state: object) => EmailSubscriber[] = createSelector(
  selectSubscriberState,
  fromSubscribers.selectAll
);

export const selectSubscriberById: (subscriberId: string) => MemoizedSelector<object, EmailSubscriber>
= (subscriberId: string) => createSelector(
  selectSubscriberState,
  subscriberState => subscriberState.entities[subscriberId]
);

export const selectSubscriberError: MemoizedSelector<object, any> = createSelector(
  selectSubscriberState,
  getError
);

export const selectSubscriberIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectSubscriberState, getIsLoading);

export const selectSubscribersLoaded: MemoizedSelector<object, boolean>
= createSelector(selectSubscriberState, getSubscribersLoaded);

