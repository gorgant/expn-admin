import { Component, ElementRef, Input, SecurityContext, ViewChild, computed, inject, input, viewChild } from '@angular/core';
import { PublicImagePaths } from '../../../../../../shared-models/routes-and-paths/image-paths.model';
import { UiService } from '../../../../core/services/ui.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GlobalFieldValues } from '../../../../../../shared-models/content/string-vals.model';
import { Post, PostKeys } from '../../../../../../shared-models/posts/post.model';

@Component({
  selector: 'app-post-hero',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './post-hero.component.html',
  styleUrl: './post-hero.component.scss'
})
export class PostHeroComponent {

  $post = input.required<Post>();
  
  ACTION_MESSAGE = GlobalFieldValues.VIEW_POST;
  DEFAULT_POST_IMAGE_URL = PublicImagePaths.POST_HERO;
  
  private $contentStartTag = viewChild<ElementRef>('contentStartTag');
  
  private uiService = inject(UiService);
  private sanitizer = inject(DomSanitizer);

  $stylesObject = computed(() => {
    const backgroundImageUrl = `url(${this.$post()[PostKeys.HERO_IMAGES].imageUrlLarge})`;
    let linearGradient = 'linear-gradient(0deg, rgba(0,0,0,0.6) 100%, rgba(9,9,121,0.006) 100%)';
    if  (this.uiService.$screenIsMobile()) {
      linearGradient = 'linear-gradient(0deg, rgba(0,0,0,0.5) 100%, rgba(9,9,121,0.006) 100%)';
    }
    const combinedStyles = `${linearGradient}, ${backgroundImageUrl}`; // Layer in the gradient
    const sanitizedStylesObject = this.sanitizer.sanitize(SecurityContext.STYLE, combinedStyles); // Sanitize styles object
    console.log('Produced this sanitized styles object', sanitizedStylesObject);
    return sanitizedStylesObject;
  });

  scrollToTextStart() {
    this.$contentStartTag()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


}
