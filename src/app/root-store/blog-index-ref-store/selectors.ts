import { createFeatureSelector, createSelector } from "@ngrx/store";
import { BlogIndexRefState } from "./state";
import * as fromBlogIndexRefs from './reducer';
import { AdminStoreFeatureKeys } from "../../../../shared-models/store/feature-keys.model";
import { BlogIndexRef, PostKeys } from "../../../../shared-models/posts/post.model";

const selectBlogIndexRefState = createFeatureSelector<BlogIndexRefState>(AdminStoreFeatureKeys.BLOG_INDEX_REF);

const getAllBlogIndexRefsFetched = (state: BlogIndexRefState) => state.allBlogIndexRefsFetched;
const getFetchAllBlogIndexRefsError = (state: BlogIndexRefState) => state.fetchAllBlogIndexRefsError;
const getFetchAllBlogIndexRefsProcessing = (state: BlogIndexRefState) => state.fetchAllBlogIndexRefsProcessing;

export const selectAllBlogIndexRefsFetched = createSelector(
  selectBlogIndexRefState,
  getAllBlogIndexRefsFetched
);

export const selectAllBlogIndexRefsInStore: (state: object) => BlogIndexRef[] = createSelector(
  selectBlogIndexRefState,
  fromBlogIndexRefs.selectAll
);

export const selectAllFeaturedBlogIndexRefs = createSelector(
  selectAllBlogIndexRefsInStore,
  (blogIndexRefs) => blogIndexRefs.filter(blogIndexRef => blogIndexRef[PostKeys.FEATURED] && blogIndexRef[PostKeys.PUBLISHED])
);

export const selectAllPublishedBlogIndexRefs = createSelector(
  selectAllBlogIndexRefsInStore,
  (blogIndexRefs) => blogIndexRefs.filter(blogIndexRef => blogIndexRef[PostKeys.PUBLISHED])
);

export const selectAllUnpublishedBlogIndexRefs = createSelector(
  selectAllBlogIndexRefsInStore,
  (blogIndexRefs) => blogIndexRefs.filter(blogIndexRef => !blogIndexRef[PostKeys.PUBLISHED])
);

export const selectFetchAllBlogIndexRefsError = createSelector(
  selectBlogIndexRefState,
  getFetchAllBlogIndexRefsError
);

export const selectFetchAllBlogIndexRefsProcessing = createSelector(
  selectBlogIndexRefState,
  getFetchAllBlogIndexRefsProcessing
);