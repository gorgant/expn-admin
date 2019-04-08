import { Component, OnInit, SecurityContext, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/core/models/posts/post.model';
import { PostService } from 'src/app/core/services/post.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ImagePaths } from 'src/app/core/models/routes-and-paths/image-paths.model';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';

@Component({
  selector: 'app-blog-preview',
  templateUrl: './blog-preview.component.html',
  styleUrls: ['./blog-preview.component.scss'],
})
export class BlogPreviewComponent implements OnInit {

  @ViewChild('contentStartTag') ContentStartTag: ElementRef;

  appRoutes = AppRoutes;

  postId: string;
  postData$: Observable<Post>;

  heroImagePlaceholder = ImagePaths.HERO_PLACEHOLDER;

  postTitle: string;
  sanitizedPostBody: SafeHtml;

  stylesObject: {};

  videoHtml: SafeHtml;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.loadExistingPostData();
    this.configureBackgroundStyleObject();
  }


  scrollToTextStart() {
    this.ContentStartTag.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private configureBackgroundStyleObject() {
    console.log('Styles object being called');
    this.postData$
      .pipe(take(1))
      .subscribe(post => {
        const linearGradient = 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(9,9,121,0.006) 100%)';
        let backgroundImageUrl: string;

        // Load image otherwise load placeholder
        if (post.heroImageProps) {
          backgroundImageUrl = `url(${post.heroImageProps.src})`;
        } else {
          backgroundImageUrl = `url(${this.heroImagePlaceholder})`;
        }

        const combinedStyles = `${linearGradient}, ${backgroundImageUrl}`; // Layer in the gradient
        const safeStyles = this.sanitizer.bypassSecurityTrustStyle(`${combinedStyles}`); // Mark string as safe

        this.stylesObject = safeStyles;
      });
  }

  private loadExistingPostData() {
    // Check if id params are available
    const idParamName = 'id';
    const idParam = this.route.snapshot.params[idParamName];
    if (idParam) {
      this.postId = idParam;
      this.postData$ = this.postService.getPostData(this.postId);
    }

    // If post data available, patch values into form
    this.postData$
    .pipe(take(1))
    .subscribe(post => {
      if (post) {
        this.sanitizedPostBody = this.sanitizer.sanitize(SecurityContext.HTML, post.content);
        if (post.videoUrl) {
          console.log('Video detected, configuring url', post.videoUrl);
          this.configureVideoUrl(post.videoUrl);
        }
      }
    });
  }

  private configureVideoUrl(videoUrl: string) {
    const videoId = videoUrl.split('/').pop();
    // tslint:disable-next-line:max-line-length
    const embedHtml = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    const safeVideoLink = this.sanitizer.bypassSecurityTrustHtml(embedHtml);
    this.videoHtml = safeVideoLink;
    console.log('video data loaded', this.videoHtml);
  }

}
