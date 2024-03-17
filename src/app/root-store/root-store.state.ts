import { ActionReducerMap } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { AdminStoreFeatureKeys } from '../../../shared-models/store/feature-keys.model';
import { AuthStoreState, BlogIndexRefStoreState, PodcastEpisodeStoreState, PostStoreState, UserStoreState } from '.';
import { authStoreReducer } from './auth-store/reducer';
import { podcastEpisodeStoreReducer } from './podcast-episode-store/reducer';
import { postStoreReducer } from './post-store/reducer';
import { userStoreReducer } from './user-store/reducer';
import { blogIndexRefStoreReducer } from './blog-index-ref-store/reducer';

export interface AppState {
  [AdminStoreFeatureKeys.AUTH]: AuthStoreState.AuthState;
  [AdminStoreFeatureKeys.BLOG_INDEX_REF]: BlogIndexRefStoreState.BlogIndexRefState;
  [AdminStoreFeatureKeys.USER]: UserStoreState.UserState;
  [AdminStoreFeatureKeys.PODCAST_EPISODE]: PodcastEpisodeStoreState.PodcastEpisodeState;
  [AdminStoreFeatureKeys.POST]: PostStoreState.PostState;
  router: RouterReducerState<any>;
}

export const reducers: ActionReducerMap<AppState> = {
  [AdminStoreFeatureKeys.AUTH]: authStoreReducer,
  [AdminStoreFeatureKeys.BLOG_INDEX_REF]: blogIndexRefStoreReducer,
  [AdminStoreFeatureKeys.USER]: userStoreReducer,
  [AdminStoreFeatureKeys.PODCAST_EPISODE]: podcastEpisodeStoreReducer,
  [AdminStoreFeatureKeys.POST]: postStoreReducer,
  router: routerReducer
};
