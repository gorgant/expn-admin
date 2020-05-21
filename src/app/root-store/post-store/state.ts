import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Post } from 'shared-models/posts/post.model';

export const featureAdapter: EntityAdapter<Post>
  = createEntityAdapter<Post>(
    {
      selectId: (post: Post) => post.id,
    }
  );

export interface State extends EntityState<Post> {
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isTogglingPublished: boolean;
  isTogglingFeatured: boolean;
  loadError: any;
  saveError: any;
  deleteError: any;
  publicUpdateError: any;
  postsLoaded: boolean;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    isSaving: false,
    isDeleting: false,
    isTogglingPublished: false,
    isTogglingFeatured: false,
    loadError: null,
    saveError: null,
    deleteError: null,
    publicUpdateError: null,
    postsLoaded: false
  }
);
