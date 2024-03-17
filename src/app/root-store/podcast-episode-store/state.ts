import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { FirebaseError } from "@angular/fire/app";
import { PodcastEpisode } from "../../../../shared-models/podcast/podcast-episode.model";

export const featureAdapter: EntityAdapter<PodcastEpisode> = createEntityAdapter<PodcastEpisode>({
  selectId: (podcastEpisode: PodcastEpisode) => podcastEpisode.id,
});

export interface PodcastEpisodeState extends EntityState<PodcastEpisode> {
  allPodcastEpisodesFetched: boolean,
  fetchAllPodcastEpisodesError: FirebaseError | Error | null,
  fetchAllPodcastEpisodesProcessing: boolean,
  fetchSinglePodcastEpisodeError: FirebaseError | Error | null,
  fetchSinglePodcastEpisodeProcessing: boolean,
}

export const initialPodcastEpisodeState: PodcastEpisodeState = featureAdapter.getInitialState(
  {
    allPodcastEpisodesFetched: false,
    fetchAllPodcastEpisodesError: null,
    fetchAllPodcastEpisodesProcessing: false,
    fetchSinglePodcastEpisodeError: null,
    fetchSinglePodcastEpisodeProcessing: false,
  }
);