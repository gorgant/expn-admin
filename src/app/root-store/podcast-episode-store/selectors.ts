import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { PodcastEpisodeState } from "./state";
import * as fromPodcastEpisodes from './reducer';
import { PublicStoreFeatureKeys } from "../../../../shared-models/store/feature-keys.model";
import { PodcastEpisode } from "../../../../shared-models/podcast/podcast-episode.model";

const selectPodcastEpisodeState = createFeatureSelector<PodcastEpisodeState>(PublicStoreFeatureKeys.PODCAST_EPISODE);

const getAllPodcastEpisodesFetched = (state: PodcastEpisodeState) => state.allPodcastEpisodesFetched;
const getFetchAllPodcastEpisodesError = (state: PodcastEpisodeState) => state.fetchAllPodcastEpisodesError;
const getFetchAllPodcastEpisodesProcessing = (state: PodcastEpisodeState) => state.fetchAllPodcastEpisodesProcessing;
const getFetchSinglePodcastEpisodeError = (state: PodcastEpisodeState) => state.fetchSinglePodcastEpisodeError;
const getFetchSinglePodcastEpisodeProcessing = (state: PodcastEpisodeState) => state.fetchSinglePodcastEpisodeProcessing;


export const selectAllPodcastEpisodesInStore: (state: object) => PodcastEpisode[] = createSelector(
  selectPodcastEpisodeState,
  fromPodcastEpisodes.selectAll
);

export const selectAllPodcastEpisodesFetched = createSelector(
  selectPodcastEpisodeState,
  getAllPodcastEpisodesFetched
);

export const selectFetchAllPodcastEpisodesError = createSelector(
  selectPodcastEpisodeState,
  getFetchAllPodcastEpisodesError
);

export const selectFetchAllPodcastEpisodesProcessing = createSelector(
  selectPodcastEpisodeState,
  getFetchAllPodcastEpisodesProcessing
);

export const selectFetchSinglePodcastEpisodeError = createSelector(
  selectPodcastEpisodeState,
  getFetchSinglePodcastEpisodeError
);

export const selectFetchSinglePodcastEpisodeProcessing = createSelector(
  selectPodcastEpisodeState,
  getFetchSinglePodcastEpisodeProcessing
);

export const selectPodcastEpisodeById: (sessionId: string) => MemoizedSelector<object, PodcastEpisode | undefined> = (sessionId: string) => createSelector(
  selectPodcastEpisodeState,
  podcastEpisodeState => podcastEpisodeState.entities[sessionId]
);
