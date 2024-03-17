import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { BlogIndexRef } from "../../../../shared-models/posts/post.model";
import { FirebaseError } from "@angular/fire/app";

export const featureAdapter: EntityAdapter<BlogIndexRef> = createEntityAdapter<BlogIndexRef>({
  selectId: (blogIndexRef: BlogIndexRef) => blogIndexRef.id,
});

export interface BlogIndexRefState extends EntityState<BlogIndexRef> {
  allBlogIndexRefsFetched: boolean,
  fetchAllBlogIndexRefsError: FirebaseError | Error | null,
  fetchAllBlogIndexRefsProcessing: boolean,
}

export const initialBlogIndexRefState: BlogIndexRefState = featureAdapter.getInitialState(
  {
    allBlogIndexRefsFetched: false,
    fetchAllBlogIndexRefsError: null,
    fetchAllBlogIndexRefsProcessing: false,
  }
);