import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Post } from 'src/app/core/models/posts/post.model';

export const featureAdapter: EntityAdapter<Post>
  = createEntityAdapter<Post>(
    {
      selectId: (post: Post) => post.id,
    }
  );

export interface State extends EntityState<Post> {
  isLoading?: boolean;
  postsLoaded?: boolean;
  error?: any;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    postsLoaded: false,
    error: null,
  }
);
