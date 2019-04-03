import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HeroImageProps } from 'src/app/core/models/posts/hero-image-props.model';
import { Observable, BehaviorSubject, throwError, merge, Subscription, of } from 'rxjs';
import { PostService } from 'src/app/core/services/post.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, catchError, take, switchMap } from 'rxjs/operators';
import { InlineImageUploadAdapter } from 'src/app/core/utils/inline-image-upload-adapter';
import { Post } from 'src/app/core/models/posts/post.model';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors } from 'src/app/root-store';
import { AppUser } from 'src/app/core/models/user/app-user.model';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DeleteConfData } from 'src/app/core/models/forms/delete-conf-data.model';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';

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
  imageProcessingSubscription: Subscription;

  // Add "types": ["node"] to tsconfig.app.json to remove TS error from NodeJS.Timer function
  autoSaveTicker: NodeJS.Timer;
  autoSavePostSubscription: Subscription;

  tempPostTitle: string;

  postDiscarded: boolean;

  postData$: Observable<Post>;
  // postDataSubscription: Subscription;

  newPost: boolean;

  constructor(
    private store$: Store<RootStoreState.State>,
    private postService: PostService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.newPost = true;
    this.postId = this.postService.generateNewPostId();
    this.tempPostTitle = `Untitled Post ${this.postId.substr(0, 4)}`;


    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: [{value: '', disabled: false }, Validators.required]
    });

    // Check if id params are available
    const idParamName = 'id';
    const idParam = this.route.snapshot.params[idParamName];
    if (idParam) {
      this.newPost = false;
      this.postInitialized = true;
      this.postId = idParam;
      this.postData$ = this.postService.getPostData(this.postId);
    }

    // If post data available, patch values into form
    this.postData$
      .pipe(take(1))
      .subscribe(post => {
        if (post) {
          const data = {
            content: post.content,
            title: post.title,
          };
          this.postForm.patchValue(data);
          this.heroImageProps$ = of(post.heroImageProps);
        }
    });

    this.imageProcessingSubscription = merge(this.heroUploadProcessing$, this.inlineUploadProcessing$)
      .subscribe((imageProcessing) => {
        if (imageProcessing) {
          console.log('Image processing, disabling content');
          this.content.disable();
        } else {
          console.log('Image not processing, enabling content');
          this.content.enable();
        }
      });

    // Auto-init post if it hasn't already been initialized and it has content
    setTimeout(() => {
      if (!this.postInitialized) {
        this.initializePost();
      }
      this.createAutoSaveTicker();
    }, 5000);





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
      } else {
        this.savePost();
      }
      return new InlineImageUploadAdapter(loader, this.postId);
    };
  }

  onUploadHeroImage(event: any): void {

    const file: File = event.target.files[0];

    // Confirm valid file type
    if (file.type.split('/')[0] !== 'image') {
      return alert('only images allowed');
    }

    this.heroUploadProcessing$.next(true);

    // Initialize post if not yet done
    if (!this.postInitialized) {
      this.initializePost();
    } else {
      this.savePost();
    }

    // Upload file
    this.postService.uploadHeroImage(file, this.postId);

    // Set image props (on db and on this page)
    this.heroImageProps$ = this.setUpdatedHeroImageProps();
  }

  onCreatePost() {
    this.savePost();
    this.router.navigate([AppRoutes.BLOG_DASHBOARD]);
  }

  onDiscardPost() {
    const dialogConfig = new MatDialogConfig();

    const deleteConfData: DeleteConfData = {
      title: 'Discard Post',
      body: 'Are you sure you want to permanently discard this post?'
    };

    dialogConfig.data = deleteConfData;

    const dialogRef = this.dialog.open(DeleteConfirmDialogueComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe(userConfirmed => {
      if (userConfirmed) {
        this.postDiscarded = true;
        this.router.navigate([AppRoutes.BLOG_DASHBOARD]);
        this.postService.deletePost(this.postId);
      }
    });
  }

  private initializePost(): void {
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
          title: this.title.value ? this.title.value : this.tempPostTitle,
          id: this.postId
        };
        this.postService.initPost(data, this.postId);
        this.postInitialized = true;
      });

  }

  private savePost(): void {
    this.appUser$
      .pipe(take(1))
      .subscribe(appUser => {
        const data: Post = {
          author: appUser.displayName || appUser.id,
          authorId: appUser.id,
          content: this.content.value,
          published: new Date(),
          title: this.title.value ? this.title.value : this.tempPostTitle,
          id: this.postId
        };
        this.postService.updatePost(this.postId, data);
        console.log('Post data saved', data);
      });
  }

  private createAutoSaveTicker() {
    console.log('Creating autosave ticker');
    // Set interval at 1 second
    const step = 10000;

    this.autoSavePostSubscription = this.postService.getPostData(this.postId)
      .subscribe(post => {
        if (this.autoSaveTicker) {
          // Clear old interval
          this.killAutoSaveTicker();
          console.log('clearing old interval');
        }
        if (post) {
          // Refresh interval every 10 seconds
          this.autoSaveTicker = setInterval(() => {
            this.autoSave(post);
          }, step);
        }
      });

  }

  private killAutoSaveTicker(): void {
    clearInterval(this.autoSaveTicker);
  }

  private autoSave(post: Post) {
    // Cancel autosave if no changes to content
    if (
      post.content === this.content.value &&
      (post.title === this.title.value || post.title === this.tempPostTitle)
    ) {
      console.log('No changes to content, no auto save');
      return;
    }
    this.savePost();
    console.log('Auto saving post');
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
    if (this.postInitialized && !this.postDiscarded) {
      this.savePost();
    }

    if (this.imageProcessingSubscription) {
      this.imageProcessingSubscription.unsubscribe();
    }

    if (this.autoSavePostSubscription) {
      this.autoSavePostSubscription.unsubscribe();
    }

    // if (this.postDataSubscription) {
    //   this.postDataSubscription.unsubscribe();
    // }

    if (this.autoSaveTicker) {
      this.killAutoSaveTicker();
    }
  }

  get title() { return this.postForm.get('title'); }
  get content() { return this.postForm.get('content'); }


}
