import { Injectable, inject } from "@angular/core";
import { FirebaseError } from "@angular/fire/app";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import * as PodcastEpisodeStoreActions from './actions';
import { PodcastService } from "../../core/services/podcast.service";

@Injectable()
export class PodcastEpisodeStoreEffects {
  
  private actions$ = inject(Actions);
  private podcastService = inject(PodcastService);
  
  constructor() { }

  fetchAllPodcastEpisodesEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PodcastEpisodeStoreActions.fetchAllPodcastEpisodesRequested),
      switchMap(action => 
        this.podcastService.fetchAllPodcastEpisodes(action.podcastContainerId).pipe(
          map(podcastEpisodes => {
            return PodcastEpisodeStoreActions.fetchAllPodcastEpisodesCompleted({podcastEpisodes});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PodcastEpisodeStoreActions.fetchAllPodcastEpisodesFailed({error: fbError}));
          })
        )
      ),
    ),
  );

  fetchSinglePodcastEpisodeEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(PodcastEpisodeStoreActions.fetchSinglePodcastEpisodeRequested),
      switchMap(action => 
        this.podcastService.fetchSinglePodcastEpisode(action.podcastContainerId, action.podcastEpisodeId).pipe(
          map(podcastEpisode => {
            return PodcastEpisodeStoreActions.fetchSinglePodcastEpisodeCompleted({podcastEpisode});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(PodcastEpisodeStoreActions.fetchSinglePodcastEpisodeFailed({error: fbError}));
          })
        )
      ),
    ),
  );

}