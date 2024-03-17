import {
  createReducer,
  on
} from '@ngrx/store';
import * as  BlogIndexRefStoreActions from './actions';
import { featureAdapter, initialBlogIndexRefState } from './state';

export const blogIndexRefStoreReducer = createReducer(
  initialBlogIndexRefState,

  // Fetch All BlogIndexRefs

  on(BlogIndexRefStoreActions.fetchAllBlogIndexRefsRequested, (state, action) => {
    return {
      ...state,
      fetchAllBlogIndexRefsProcessing: true,
      fetchAllBlogIndexRefsError: null
    }
  }),
  on(BlogIndexRefStoreActions.fetchAllBlogIndexRefsCompleted, (state, action) => {
    return featureAdapter.setAll(
      action.blogIndexRefs, {
        ...state,
        fetchAllBlogIndexRefsProcessing: false,
        allBlogIndexRefsFetched: true,
      }
    );
  }),
  on(BlogIndexRefStoreActions.fetchAllBlogIndexRefsFailed, (state, action) => {
    return {
      ...state,
      fetchAllBlogIndexRefsProcessing: false,
      fetchAllBlogIndexRefsError: action.error,
      allBlogIndexRefsFetched: false,
    }
  }),

  // Purge BlogIndexRef State

  on(BlogIndexRefStoreActions.purgeBlogIndexRefState, (state, action) => {
    return featureAdapter.removeAll(
      {
        ...state,
        allBlogIndexRefsFetched: false,
        fetchAllBlogIndexRefsError: null,
        fetchAllBlogIndexRefsProcessing: false,
      }
    );
  }),

  // Purge Post State Errors

  on(BlogIndexRefStoreActions.purgeBlogIndexRefStateErrors, (state, action) => {
    return {
      ...state,
      fetchAllBlogIndexRefsError: null,
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