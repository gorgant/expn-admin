import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSubscribers from './reducer';
import { EmailSubscriber } from 'shared-models/subscribers/email-subscriber.model';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';
import { SubCountData } from 'shared-models/subscribers/sub-count-data.model';

const getIsLoading = (state: State): boolean => state.isLoading;
const getIsExportingSubscribers = (state: State): boolean => state.isExportingSubscribers;
const getIsProcessingSubscriberCount = (state: State): boolean => state.isProcessingSubscriberCount;
const getLoadError = (state: State): any => state.loadError;
const getExportSubscribersError = (state: State): any => state.exportSubscribersError;
const getSubscriberCountError = (state: State): any => state.subscriberCountError;
const getSubscribersLoaded = (state: State): boolean => state.subscribersLoaded;
const getDownloadUrl = (state: State): string => state.downloadUrl;
const getSubscriberCountData = (state: State): SubCountData => state.subCountData;

export const selectSubscriberState: MemoizedSelector<object, State>
= createFeatureSelector<State>(AdminFeatureNames.SUBSCRIBERS);

export const selectAllSubscribers: (state: object) => EmailSubscriber[] = createSelector(
  selectSubscriberState,
  fromSubscribers.selectAll
);

export const selectSubscriberById: (subscriberId: string) => MemoizedSelector<object, EmailSubscriber>
= (subscriberId: string) => createSelector(
  selectSubscriberState,
  subscriberState => subscriberState.entities[subscriberId]
);

export const selectLoadError: MemoizedSelector<object, any> = createSelector(
  selectSubscriberState,
  getLoadError
);

export const selectExportSubscribersError: MemoizedSelector<object, any> = createSelector(
  selectSubscriberState,
  getExportSubscribersError
);

export const selectSubscriberCountError: MemoizedSelector<object, any> = createSelector(
  selectSubscriberState,
  getSubscriberCountError
);

export const selectIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectSubscriberState, getIsLoading);

export const selectIsExportingSubscribers: MemoizedSelector<object, boolean>
= createSelector(selectSubscriberState, getIsExportingSubscribers);

export const selectIsProcessingSubscriberCount: MemoizedSelector<object, boolean>
= createSelector(selectSubscriberState, getIsProcessingSubscriberCount);

export const selectSubscribersLoaded: MemoizedSelector<object, boolean>
= createSelector(selectSubscriberState, getSubscribersLoaded);

export const selectDownloadUrl: MemoizedSelector<object, string>
= createSelector(selectSubscriberState, getDownloadUrl);

export const selectSubscriberCountData: MemoizedSelector<object, SubCountData>
= createSelector(selectSubscriberState, getSubscriberCountData);

