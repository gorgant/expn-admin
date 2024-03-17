import { createAction, props } from "@ngrx/store";
import { FirebaseError } from "@angular/fire/app";
import { PodcastEpisode } from "../../../../shared-models/podcast/podcast-episode.model";

// Fetch All Podcast Episodes

export const fetchAllPodcastEpisodesRequested = createAction(
  '[Podcast Component] Fetch All Podcast Episodes Requested',
  props<{podcastContainerId: string}>()
);

export const fetchAllPodcastEpisodesCompleted = createAction(
  '[Podcast Service] Fetch All Podcast Episodes Completed',
  props<{podcastEpisodes: PodcastEpisode[]}>()
);

export const fetchAllPodcastEpisodesFailed = createAction(
  '[Podcast Service] Fetch All Podcast Episodes Failed',
  props<{error: FirebaseError}>()
);

// Fetch Single Podcast Episode

export const fetchSinglePodcastEpisodeRequested = createAction(
  '[Podcast Component] Fetch Single Podcast Episode Requested',
  props<{podcastContainerId: string, podcastEpisodeId: string}>()
);

export const fetchSinglePodcastEpisodeCompleted = createAction(
  '[Podcast Service] Fetch Single Podcast Episode Completed',
  props<{podcastEpisode: PodcastEpisode}>()
);

export const fetchSinglePodcastEpisodeFailed = createAction(
  '[Podcast Service] Fetch Single Podcast Episode Failed',
  props<{error: FirebaseError}>()
);

// Purge Podcast Episode State

export const purgePodcastEpisodeState = createAction(
  '[AppWide] Purge Podcast Episode State'
);

// Purge Podcast Episode State Errors

export const purgePodcastEpisodeStateErrors = createAction(
  '[AppWide] Purge Podcast Episode State Errors'
);