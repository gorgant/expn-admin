import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromEpisodes from './reducer';
import { PodcastEpisode } from 'shared-models/podcast/podcast-episode.model';

const getError = (state: State): any => state.error;
const getIsLoading = (state: State): boolean => state.isLoading;
const getEpisodesLoaded = (state: State): boolean => state.episodesLoaded;

export const selectEpisodeState: MemoizedSelector<object, State>
= createFeatureSelector<State>('podcast');

export const selectAllEpisodes: (state: object) => PodcastEpisode[] = createSelector(
  selectEpisodeState,
  fromEpisodes.selectAll
);

export const selectEpisodeById: (episodeId: string) => MemoizedSelector<object, PodcastEpisode>
= (episodeId: string) => createSelector(
  selectEpisodeState,
  episodesState => episodesState.entities[episodeId]
);

export const selectEpisodeError: MemoizedSelector<object, any> = createSelector(
  selectEpisodeState,
  getError
);

export const selectEpisodeIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectEpisodeState, getIsLoading);

export const selectEpisodesLoaded: MemoizedSelector<object, boolean>
= createSelector(selectEpisodeState, getEpisodesLoaded);
