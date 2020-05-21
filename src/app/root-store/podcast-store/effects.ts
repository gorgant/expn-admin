import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as episodeFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { PodcastService } from 'src/app/core/services/podcast.service';

@Injectable()
export class PodcastStoreEffects {
  constructor(
    private episodeService: PodcastService,
    private actions$: Actions,
  ) { }

  @Effect()
  singleEpisodeRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<episodeFeatureActions.SingleEpisodeRequested>(
      episodeFeatureActions.ActionTypes.SINGLE_EPISODE_REQUESTED
    ),
    mergeMap(action =>
      this.episodeService.fetchSinglePodcastEpisode(action.payload.podcastId, action.payload.episodeId)
        .pipe(
          map(episode => {
            if (!episode) {
              throw new Error('Episode not found');
            }
            return new episodeFeatureActions.SingleEpisodeLoaded({ episode });
          }),
          catchError(error => {
            return of(new episodeFeatureActions.LoadErrorDetected({ error: error.message }));
          })
        )
    )
  );

  @Effect()
  allEpisodesRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<episodeFeatureActions.AllEpisodesRequested>(
      episodeFeatureActions.ActionTypes.ALL_EPISODES_REQUESTED
    ),
    switchMap(action =>
      this.episodeService.fetchAllPodcastEpisodes(action.payload.podcastId)
        .pipe(
          map(episodes => {
            if (!episodes) {
              throw new Error('Episodes not found');
            }
            return new episodeFeatureActions.AllEpisodesLoaded({ episodes });
          }),
          catchError(error => {
            return of(new episodeFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

}
