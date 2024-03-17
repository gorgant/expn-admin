import { Injectable, inject } from "@angular/core";
import { FirebaseError } from "@angular/fire/app";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import * as BlogIndexRefStoreActions from './actions';
import { BlogIndexRefService } from "../../core/services/blog-index-ref.service";

@Injectable()
export class BlogIndexRefStoreEffects {

  private actions$ = inject(Actions);
  private blogIndexRefService = inject(BlogIndexRefService);

  constructor() { }

  fetchAllBlogIndexRefsEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType(BlogIndexRefStoreActions.fetchAllBlogIndexRefsRequested),
      switchMap(action => 
        this.blogIndexRefService.fetchAllBlogIndexRefs().pipe(
          map(blogIndexRefs => {
            return BlogIndexRefStoreActions.fetchAllBlogIndexRefsCompleted({blogIndexRefs});
          }),
          catchError(error => {
            const fbError: FirebaseError = {
              code: error.code,
              message: error.message,
              name: error.name
            };
            return of(BlogIndexRefStoreActions.fetchAllBlogIndexRefsFailed({error: fbError}));
          })
        )
      ),
    ),
  );


}