import { Component, Input, input } from '@angular/core';
import { BlogIndexRef } from '../../../../../shared-models/posts/post.model';
import { PostCardComponent } from "../post-card/post-card.component";

@Component({
    selector: 'app-post-collection',
    standalone: true,
    templateUrl: './post-collection.component.html',
    styleUrl: './post-collection.component.scss',
    imports: [PostCardComponent]
})
export class PostCollectionComponent {

  $blogIndexRefs = input.required<BlogIndexRef[]>();

}
