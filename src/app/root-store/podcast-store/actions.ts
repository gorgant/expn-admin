import { Action } from '@ngrx/store';
import { PodcastEpisode } from 'shared-models/podcast/podcast-episode.model';

export enum ActionTypes {
  SINGLE_EPISODE_REQUESTED = '[Episodes] Single Episode Requested',
  SINGLE_EPISODE_LOADED = '[Episodes] Single Episode Loaded',
  ALL_EPISODES_REQUESTED = '[Episodes] All Episodes Requested',
  ALL_EPISODES_LOADED = '[Episodes] All Episodes Loaded',
  EPISODE_LOAD_FAILURE = '[Episodes] Load Failure',
}

export class SingleEpisodeRequested implements Action {
  readonly type = ActionTypes.SINGLE_EPISODE_REQUESTED;
  constructor(public payload: { podcastId: string, episodeId: string }) {}
}

export class SingleEpisodeLoaded implements Action {
  readonly type = ActionTypes.SINGLE_EPISODE_LOADED;
  constructor(public payload: { episode: PodcastEpisode }) {}
}

export class AllEpisodesRequested implements Action {
  readonly type = ActionTypes.ALL_EPISODES_REQUESTED;
  constructor(public payload: { podcastId: string }) {}
}

export class AllEpisodesLoaded implements Action {
  readonly type = ActionTypes.ALL_EPISODES_LOADED;
  constructor(public payload: { episodes: PodcastEpisode[] }) {}
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.EPISODE_LOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export type Actions =
  SingleEpisodeRequested |
  SingleEpisodeLoaded |
  AllEpisodesRequested |
  AllEpisodesLoaded |
  LoadErrorDetected
  ;
