import { createAction, props } from "@ngrx/store";
import { BlogIndexRef } from "../../../../shared-models/posts/post.model";
import { FirebaseError } from "@angular/fire/app";

// Fetch All BlogIndexRefs

export const fetchAllBlogIndexRefsRequested = createAction(
  '[Blog Component] Fetch All Blog Index Refs Requested',
);

export const fetchAllBlogIndexRefsCompleted = createAction(
  '[BlogIndexRef Service] Fetch All Blog Index Refs Completed',
  props<{blogIndexRefs: BlogIndexRef[]}>()
);

export const fetchAllBlogIndexRefsFailed = createAction(
  '[BlogIndexRef Service] Fetch All Blog Index Refs Failed',
  props<{error: FirebaseError}>()
);

// Purge BlogIndexRef State

export const purgeBlogIndexRefState = createAction(
  '[AppWide] Purge BlogIndexRef State'
);

// Purge BlogIndexRef State Errors

export const purgeBlogIndexRefStateErrors = createAction(
  '[AppWide] Purge BlogIndexRef State Errors'
);