import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { PodcastEpisode } from 'shared-models/podcast/podcast-episode.model';

export const featureAdapter: EntityAdapter<PodcastEpisode>
  = createEntityAdapter<PodcastEpisode>(
    {
      selectId: (episode: PodcastEpisode) => episode.id,

      // Sort by reverse published date
      sortComparer: (a: PodcastEpisode, b: PodcastEpisode): number => {
        const publishedDateA = a.pubDate;
        const publishedDateB = b.pubDate;
        return publishedDateB.toString().localeCompare(publishedDateA.toString(), undefined, {numeric: true});
      }
    }
  );

export interface State extends EntityState<PodcastEpisode> {
  isLoading?: boolean;
  error?: any;
  episodesLoaded?: boolean;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    error: null,
    episodesLoaded: false,
  }
);
