import { Component, Input, OnInit, SecurityContext, inject, input, signal } from '@angular/core';
import { Post, PostKeys } from '../../../../../../shared-models/posts/post.model';
import { ProcessingSpinnerComponent } from "../../../../shared/components/processing-spinner/processing-spinner.component";
import { DomSanitizer } from '@angular/platform-browser';
import { PostBoilerplate, PostBoilerplateKeys } from '../../../../../../shared-models/posts/post-boilerplate.model';

@Component({
    selector: 'app-post-content',
    standalone: true,
    templateUrl: './post-content.component.html',
    styleUrl: './post-content.component.scss',
    imports: [ProcessingSpinnerComponent]
})
export class PostContentComponent implements OnInit {

  $post = input.required<Post>();
  $postBoilerplate = input.required<PostBoilerplate>();

  $sanitizedPostBody = signal(undefined as string | undefined | null);

  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.initializePostContent();    
  }

  private initializePostContent() {
    const postContent = this.$post()[PostKeys.CONTENT] + this.$postBoilerplate()[PostBoilerplateKeys.CONTENT];
    const sanitizedPostContent = this.sanitizer.sanitize(SecurityContext.HTML, postContent); // Sanitize styles object
    this.$sanitizedPostBody.set(sanitizedPostContent);
  }

}
