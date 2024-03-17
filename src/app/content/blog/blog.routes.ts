import { Routes } from "@angular/router";
import { BlogComponent } from "./blog.component";
import { PostComponent } from "./post/post.component";
import { EditPostComponent } from "./edit-post/edit-post.component";
import { PostKeys } from "../../../../shared-models/posts/post.model";
import { UnsavedChangesGuard } from "../../core/route-guards/unsaved-changes.guard";

export const BLOG_ROUTES: Routes = [
  {
    path: '',
    component: BlogComponent
  },
  {
    path: `edit/:${PostKeys.ID}`,
    component: EditPostComponent,
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: `:${PostKeys.ID}/:postTitle`,
    component: PostComponent
  },
  {
    path: 'new',
    component: EditPostComponent,
  },

];