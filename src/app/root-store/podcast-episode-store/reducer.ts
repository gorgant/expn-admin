import {
  createReducer,
  on
} from '@ngrx/store';
import * as  PodcastEpisodeActions from './actions';
import { featureAdapter, initialPodcastEpisodeState } from './state';

export const podcastEpisodeStoreReducer = createReducer(
  initialPodcastEpisodeState,

  // Fetch All Podcast Episodes

  on(PodcastEpisodeActions.fetchAllPodcastEpisodesRequested, (state, action) => {
    return {
      ...state,
      fetchAllPodcastEpisodesProcessing: true,
      fetchAllPodcastEpisodesError: null
    }
  }),
  on(PodcastEpisodeActions.fetchAllPodcastEpisodesCompleted, (state, action) => {
    return featureAdapter.setAll(
      action.podcastEpisodes, {
        ...state,
        fetchAllPodcastEpisodesProcessing: false,
        allPodcastEpisodesFetched: true,
      }
    );
  }),
  on(PodcastEpisodeActions.fetchAllPodcastEpisodesFailed, (state, action) => {
    return {
      ...state,
      fetchAllPodcastEpisodesProcessing: false,
      fetchAllPodcastEpisodesError: action.error,
      allPodcastEpisodesFetched: false,
    }
  }),

  // Fetch Single PodcastEpisode

  on(PodcastEpisodeActions.fetchSinglePodcastEpisodeRequested, (state, action) => {
    return {
      ...state,
      fetchSinglePodcastEpisodeProcessing: true,
      fetchSinglePodcastEpisodeError: null
    }
  }),
  on(PodcastEpisodeActions.fetchSinglePodcastEpisodeCompleted, (state, action) => {
    return featureAdapter.upsertOne(
      action.podcastEpisode, {
        ...state,
        fetchSinglePodcastEpisodeProcessing: false,  
      }
    );
  }),
  on(PodcastEpisodeActions.fetchSinglePodcastEpisodeFailed, (state, action) => {
    return {
      ...state,
      fetchSinglePodcastEpisodeProcessing: false,
      fetchSinglePodcastEpisodeError: action.error
    }
  }),

  // Purge PodcastEpisode State

  on(PodcastEpisodeActions.purgePodcastEpisodeState, (state, action) => {
    return featureAdapter.removeAll(
      {
        ...state,
        allPodcastEpisodesFetched: false,
        fetchAllPodcastEpisodesError: null,
        fetchAllPodcastEpisodesProcessing: false,
        fetchSinglePodcastEpisodeError: null,
        fetchSinglePodcastEpisodeProcessing: false,
      }
    );
  }),

  // Purge PodcastEpisode State Errors

  on(PodcastEpisodeActions.purgePodcastEpisodeStateErrors, (state, action) => {
    return {
      ...state,
      fetchAllPodcastEpisodesError: null,
      fetchSinglePodcastEpisodeError: null,
    }
  }),

);

// Exporting a variety of selectors in the form of a object from the entity adapter
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = featureAdapter.getSelectors();