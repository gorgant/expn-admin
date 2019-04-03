import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HeroImageProps } from 'src/app/core/models/post-models/hero-image-props.model';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';
import { Router } from '@angular/router';
import { map, catchError, take, switchMap } from 'rxjs/operators';
import { InlineImageUploadAdapter } from 'src/app/core/utils/inline-image-upload-adapter';
import { Post } from 'src/app/core/models/post-models/post.model';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors } from 'src/app/root-store';
import { AppUser } from 'src/app/core/models/app-user.model';
import { AppRouts } from 'src/app/core/models/routes-and-paths/app-routes.model';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss']
})
export class BlogFormComponent implements OnInit, OnDestroy {

  appUser$: Observable<AppUser>;

  postForm: FormGroup;
  heroImageProps: HeroImageProps = null;

  uploadPercent$: Observable<number>;
  heroImageProps$: Observable<HeroImageProps>;

  public Editor = ClassicEditor;

  uploadTaskSnapshot: Observable<firebase.storage.UploadTaskSnapshot>;

  postId: string;

  postInitialized: boolean;

  heroUploadProcessing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  inlineUploadProcessing$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private store$: Store<RootStoreState.State>,
    private authService: AuthService,
    private postService: PostService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

    this.postId = this.postService.generateNewPostId();

    this.appUser$ = this.store$.select(UserStoreSelectors.selectAppUser);
  }

  // Inpsired by https://stackoverflow.com/a/52549978/6572208
  // Structured on https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html
  onEditorAdaptorPluginRdy(eventData) {
    console.log('uploadAdapterPlugin ready');
    eventData.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      console.log('Plugin fired, will provide this post ID', this.postId);

      this.inlineUploadProcessing$.next(true);

      this.postService.getImageSizes(this.postId)
        .pipe(
          map(imageSizes => {
            console.log('No image sizes detected');
            if (imageSizes) {
              // Signal arrival of image sizes
              console.log('Image sizes retrieved, pinging subject', imageSizes);
              this.inlineUploadProcessing$.next(false);
            }
          }),
          catchError(error => {
            console.log('Error getting image sizes', error);
            return throwError(error);
          })
        ).subscribe();

      if (!this.postInitialized) {
        this.initializePost();
      }
      return new InlineImageUploadAdapter(loader, this.postId);
    };
  }

  initializePost(): void {
    this.appUser$
      .pipe(take(1))
      .subscribe(appUser => {
        console.log('Post initialized');
        const data: Post = {
          author: appUser.displayName || appUser.id,
          authorId: appUser.id,
          content: this.content.value,
          heroImageProps: this.heroImageProps,
          published: new Date(),
          title: this.title.value ? this.title.value : `Temp Title ${this.postId.substr(0, 5)}`,
          id: this.postId
        };
        this.postService.initPost(data, this.postId);
        this.postInitialized = true;
      });

  }

  savePost(): void {
    this.appUser$
      .pipe(take(1))
      .subscribe(appUser => {
        const data: Post = {
          author: appUser.displayName || appUser.id,
          authorId: appUser.id,
          content: this.content.value,
          published: new Date(),
          title: this.title.value,
          id: this.postId
        };
        this.postService.updatePost(this.postId, data);
        this.router.navigate([AppRouts.BLOG_DASHBOARD]);
        console.log('Post data saved', data);
      });
  }

  uploadHeroImage(event: any): void {

    const file: File = event.target.files[0];

    // Confirm valid file type
    if (file.type.split('/')[0] !== 'image') {
      return alert('only images allowed');
    }

    this.heroUploadProcessing$.next(true);

    // Initialize post if not yet done
    if (!this.postInitialized) {
      this.initializePost();
    }

    // Upload file
    this.postService.uploadHeroImage(file, this.postId);

    // Set image props (on db and on this page)
    this.heroImageProps$ = this.setUpdatedHeroImageProps();
  }

  private setUpdatedHeroImageProps(): Observable<HeroImageProps> {
    return this.postService.imageSizesRetrieved
      .pipe(
        take(1),
        switchMap(imageSizes => {
          // Clear images sizes as they have been retrieved (so available for updates by other images)
          console.log('Images sizes to clear', imageSizes);
          console.log('Post to clear them on', this.postId);
          this.postService.clearImageSizes(this.postId);
          console.log('Image sizes received, fetching download urls', imageSizes);
          const urlObject$ = this.postService.fetchHeroUrlObject(this.postId, imageSizes);
          return urlObject$;
        }),
        map(urlObject => {
          this.heroImageProps = this.postService.setHeroImageProps(urlObject); // Update in local memory for when post is created
          this.postService.storeHeroImageProps(this.postId, this.heroImageProps); // Save in database pre- post creation
          console.log('About to parse this set of ulrObjects for default url', urlObject);
          this.heroUploadProcessing$.next(false);
          return this.heroImageProps; // Set for instant UI update
        })
      );
  }

  // This handles a weird error related to lastpass form detection when pressing enter
  // From: https://github.com/KillerCodeMonkey/ngx-quill/issues/351#issuecomment-476017960
  textareaEnterPressed($event: KeyboardEvent) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  ngOnDestroy(): void {
    if (this.postInitialized) {
      this.savePost();

    }
  }

  get title() { return this.postForm.get('title'); }
  get content() { return this.postForm.get('content'); }


}
