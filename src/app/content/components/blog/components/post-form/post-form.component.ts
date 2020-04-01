import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription, of, Subject, from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { take, withLatestFrom, map, takeWhile } from 'rxjs/operators';
import { InlineImageUploadAdapter } from 'src/app/core/utils/inline-image-upload-adapter';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors, PostStoreActions, PostStoreSelectors } from 'src/app/root-store';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { now } from 'moment';
import { ImageService } from 'src/app/core/services/image.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AdminUser } from 'shared-models/user/admin-user.model';
import { Post, PostKeys } from 'shared-models/posts/post.model';
import { ImageProps } from 'shared-models/images/image-props.model';
import { POST_FORM_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import { BlogDomains } from 'shared-models/posts/blog-domains.model';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { DeleteConfData } from 'shared-models/forms-and-components/delete-conf-data.model';
import { ImageType } from 'shared-models/images/image-type.model';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnDestroy {

  adminUser$: Observable<AdminUser>;
  private post$: Observable<Post>;
  postLoaded: boolean;
  heroImageProps$: Observable<ImageProps>;
  imageUploadProcessing$: Subject<boolean>;

  postForm: FormGroup;
  postFormKeys = PostKeys;
  postValidationMessages = POST_FORM_VALIDATION_MESSAGES;
  descriptionMaxLength = 320;
  keywordsMaxLength = 100;
  isNewPost: boolean;

  blogDomains: string[] = Object.values(BlogDomains);


  private postId: string;
  private tempPostTitle: string;
  private originalPost: Post;
  postInitialized: boolean;
  private postDiscarded: boolean;
  private heroImageAdded: boolean; // Helps determine if post is blank
  private imagesModifiedSinceLastSave: boolean;
  private manualSave: boolean;

  private initPostTimeout: NodeJS.Timer;
  // Add "types": ["node"] to tsconfig.app.json to remove TS error from NodeJS.Timer function
  private autoSaveTicker: NodeJS.Timer;
  private autoSavePostSubscription: Subscription;
  private savePostSubscription: Subscription;
  private deletePostSubscription: Subscription;
  private imageProcessingSubscription: Subscription;

  public Editor = ClassicEditor;

  private currentImageProps: ImageProps; // Keeps a local copy of current image props for realtime usage

  constructor(
    private store$: Store<RootStoreState.State>,
    private utilsService: UtilsService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private imageService: ImageService,
  ) { }

  ngOnInit() {

    this.configureNewPost();

    this.loadExistingPostData(); // Only loads if exists

    this.adminUser$ = this.store$.select(UserStoreSelectors.selectUser);

  }

  onSave() {
    this.manualSave = true;
    this.savePost();
    this.router.navigate([AdminAppRoutes.BLOG_DASHBOARD]);
  }

  onDiscardEdits() {
    const dialogConfig = new MatDialogConfig();

    const deleteConfData: DeleteConfData = {
      title: 'Discard Edits',
      body: 'Are you sure you want to discard your edits?'
    };

    dialogConfig.data = deleteConfData;

    const dialogRef = this.dialog.open(DeleteConfirmDialogueComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(userConfirmed => {
        if (userConfirmed) {
          this.postDiscarded = true;
          // If new item, delete it entirely
          if (this.isNewPost) {
            if (this.deletePostSubscription) {
              this.deletePostSubscription.unsubscribe();
            }
            this.store$.dispatch(new PostStoreActions.DeletePostRequested({postId: this.postId}));
            this.reactToDeletOutcome();
          } else {
            if (this.savePostSubscription) {
              this.savePostSubscription.unsubscribe();
            }
            // If existing item, revert to original version (but use current image list)
            this.post$
              .pipe(take(1))
              .subscribe(post => {
                // Insert the latest imageFilePathList so that if item it is deleted, all images are scrubbed
                // After all, images get uploaded irrespective of if changes are discarded
                const originalItemWithCurrentImageList: Post = {
                  ...this.originalPost,
                  imageFilePathList: post.imageFilePathList ? post.imageFilePathList : null
                };
                console.log('Original item to revert to', this.originalPost);
                console.log('Original item with current image list', originalItemWithCurrentImageList);
                this.store$.dispatch(new PostStoreActions.UpdatePostRequested({post: originalItemWithCurrentImageList}));
                this.reactToSaveOutcome(post);
              });
          }
        }
      });
  }

  // Inpsired by https://stackoverflow.com/a/52549978/6572208
  // Structured on https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html
  onEditorAdaptorPluginRdy(eventData) {
    console.log('uploadAdapterPlugin ready');
    eventData.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      console.log('Plugin fired, will provide this post ID', this.postId);

      // Mark post initialized
      if (!this.postInitialized) {
        this.initializePost();
      } else {
        this.savePost();
      }

      // Initiate the image upload process
      return new InlineImageUploadAdapter(loader, this.postId, this.imageService);
    };

  }

  onUploadHeroImage(event: any): void {

    const file: File = event.target.files[0];

    // Confirm valid file type
    if (file.type.split('/')[0] !== 'image') {
      return alert('only images allowed');
    }

    // Initialize post if not yet done
    if (!this.postInitialized) {
      this.initializePost();
    } else {
      this.savePost();
    }

    // Upload file and get image props
    this.heroImageProps$ = from(
      this.imageService.uploadImageAndGetProps(file, this.postId, ImageType.BLOG_HERO)
        .then(imageProps => {
          this.heroImageAdded = true;
          this.currentImageProps = imageProps;
          this.imagesModifiedSinceLastSave = true; // Used for auto-save change detection only after image uploaded
          return imageProps;
        })
      );
  }

  // This handles a weird error related to lastpass form detection when pressing enter
  // From: https://github.com/KillerCodeMonkey/ngx-quill/issues/351#issuecomment-476017960
  textareaEnterPressed($event: KeyboardEvent) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  private loadExistingPostData() {
    // Check if id params are available
    const idParamName = 'id';
    const idParam = this.route.snapshot.params[idParamName];
    if (idParam) {
      this.postInitialized = true;
      this.postId = idParam;
      console.log('Post detected with id', idParam);
      this.post$ = this.getPost(this.postId);

      // If post data available, patch values into form
      this.post$
        .pipe(
          takeWhile( item => !this.originalPost) // Take until an item is loaded into memory
        )
        .subscribe(post => {
          if (post) {
            const data: Partial<Post> = {
              [PostKeys.BLOG_DOMAIN]: post[PostKeys.BLOG_DOMAIN],
              [PostKeys.TITLE]: post[PostKeys.TITLE],
              [PostKeys.VIDEO_URL]: post[PostKeys.VIDEO_URL],
              [PostKeys.PODCAST_EPISODE_URL]: post[PostKeys.PODCAST_EPISODE_URL],
              [PostKeys.DESCRIPTION]: post[PostKeys.DESCRIPTION],
              [PostKeys.KEYWORDS]: post[PostKeys.KEYWORDS],
              [PostKeys.CONTENT]: post[PostKeys.CONTENT],
            };
            console.log('Patching post data into form', data);
            this.postForm.patchValue(data);
            this.heroImageProps$ = of(post.imageProps);
            if (post.imageProps) {
              this.heroImageAdded = true;
              this.currentImageProps = post.imageProps;
            }
            this.isNewPost = false;
            this.originalPost = post;
          }
      });
    }
  }

  private getPost(postId: string): Observable<Post> {
    console.log('Getting post', postId);
    return this.store$.select(PostStoreSelectors.selectPostById(postId))
    .pipe(
      withLatestFrom(
        this.store$.select(PostStoreSelectors.selectLoaded)
      ),
      map(([post, postsLoaded]) => {
        // Check if items are loaded, if not fetch from server
        if (!postsLoaded && !this.postLoaded) {
          console.log('No post in store, fetching from server', postId);
          this.store$.dispatch(new PostStoreActions.SinglePostRequested({postId}));
        }
        console.log('Single post status', this.postLoaded);
        this.postLoaded = true; // Prevents loading from firing more than needed
        return post;
      })
    );
  }

  private configureNewPost() {
    this.postForm = this.fb.group({
      [PostKeys.BLOG_DOMAIN]: [BlogDomains.EXPLEARNING, Validators.required],
      [PostKeys.TITLE]: ['', Validators.required],
      [PostKeys.VIDEO_URL]: ['', [Validators.pattern(/^\S*(?:https\:\/\/youtu\.be)\S*$/)]],
      [PostKeys.PODCAST_EPISODE_URL]: ['', [Validators.pattern(/^\S*(?:https\:\/\/soundcloud\.com)\S*$/)]],
      [PostKeys.DESCRIPTION]: ['', [Validators.required, Validators.maxLength(this.descriptionMaxLength)]],
      [PostKeys.KEYWORDS]: ['', [Validators.required, Validators.maxLength(this.keywordsMaxLength)]],
      [PostKeys.CONTENT]: [{value: '', disabled: false }, Validators.required],
    });

    this.imageUploadProcessing$ = this.imageService.getImageProcessing(); // Monitor image processing
    this.setContentFormStatus();
    this.isNewPost = true;
    this.postId = `${this.utilsService.generateRandomCharacterNoCaps(8)}`; // Use custom ID creator to avoid caps in URLs
    this.tempPostTitle = `Untitled Post ${this.postId.substr(0, 4)}`;

    // Auto-init post if it hasn't already been initialized and it has content
    this.initPostTimeout = setTimeout(() => {
      if (!this.postInitialized) {
        this.initializePost();
      }
      this.createAutoSaveTicker();
    }, 5000);
  }



  private setContentFormStatus(): void {
    this.imageProcessingSubscription = this.imageUploadProcessing$
      .subscribe(imageProcessing => {
        switch (imageProcessing) {
          case true:
            return this[PostKeys.CONTENT].disable();
          case false:
            return this[PostKeys.CONTENT].enable();
          default:
            return this[PostKeys.CONTENT].enable();
        }
      });
  }

  private initializePost(): void {
    this.adminUser$
      .pipe(take(1))
      .subscribe(adminUser => {
        console.log('Post initialized');
        const post: Post = {
          [PostKeys.BLOG_DOMAIN]: this[PostKeys.BLOG_DOMAIN].value,
          author: adminUser.email,
          authorId: adminUser.id,
          [PostKeys.VIDEO_URL]: this[PostKeys.VIDEO_URL].value,
          [PostKeys.DESCRIPTION]: this[PostKeys.DESCRIPTION].value,
          [PostKeys.KEYWORDS]: this[PostKeys.KEYWORDS].value,
          [PostKeys.CONTENT]: this[PostKeys.CONTENT].value,
          modifiedDate: now(),
          [PostKeys.TITLE]: this[PostKeys.TITLE].value ? (this[PostKeys.TITLE].value as string).trim() : this.tempPostTitle,
          id: this.postId,
          published: false,
          publishedDate: null,
          imageProps: null,
          featured: false
        };
        this.store$.dispatch(new PostStoreActions.UpdatePostRequested({post}));
        this.postInitialized = true;
      });
  }

  private createAutoSaveTicker() {
    console.log('Creating autosave ticker');
    // Set interval at 10 seconds
    const step = 10000;

    this.autoSavePostSubscription = this.getPost(this.postId)
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

  private autoSave(post: Post) {
    // Cancel autosave if no changes to content
    if (!this.changesDetected(post)) {
      console.log('No changes to content, no auto save');
      return;
    }
    this.savePost();
    console.log('Auto saving');
  }

  private changesDetected(post: Post): boolean {
    // // Enable for debugging
    // tslint:disable-next-line:max-line-length
    // console.log(`Server [PostKeys.BLOG_DOMAIN]: ${post[PostKeys.BLOG_DOMAIN]} vs local [PostKeys.BLOG_DOMAIN]: ${this[PostKeys.BLOG_DOMAIN].value}`);
    // console.log(`Server post [PostKeys.TITLE]: ${post[PostKeys.TITLE]} vs local post [PostKeys.TITLE]: ${this[PostKeys.TITLE].value}`);
    // tslint:disable-next-line:max-line-length
    // console.log(`Server post [PostKeys.VIDEO_URL]: ${post[PostKeys.VIDEO_URL]} vs local post [PostKeys.VIDEO_URL]: ${this[PostKeys.VIDEO_URL].value}`);
    // tslint:disable-next-line:max-line-length
    // console.log(`Server post [PostKeys.PODCAST_EPISODE_URL]: ${post[PostKeys.PODCAST_EPISODE_URL]} vs local post [PostKeys.PODCAST_EPISODE_URL]: ${this[PostKeys.PODCAST_EPISODE_URL].value}`);
    // tslint:disable-next-line:max-line-length
    // console.log(`Server post [PostKeys.DESCRIPTION]: ${post[PostKeys.DESCRIPTION]} vs local post [PostKeys.DESCRIPTION]: ${this[PostKeys.DESCRIPTION].value}`);
    // tslint:disable-next-line:max-line-length
    // console.log(`Server post [PostKeys.KEYWORDS]: ${post[PostKeys.KEYWORDS]} vs local post [PostKeys.KEYWORDS]: ${this[PostKeys.KEYWORDS].value}`);
    // tslint:disable-next-line:max-line-length
    // console.log(`Server post [PostKeys.CONTENT]: ${post[PostKeys.CONTENT]} vs local post [PostKeys.CONTENT]: ${this[PostKeys.CONTENT].value}`);
    // console.log(`Images modified since last save: ${this.imagesModifiedSinceLastSave}`);
    if (
      post[PostKeys.BLOG_DOMAIN] === this[PostKeys.BLOG_DOMAIN].value &&
      (post[PostKeys.TITLE] === (this[PostKeys.TITLE].value as string).trim() || post[PostKeys.TITLE] === this.tempPostTitle) &&
      post[PostKeys.VIDEO_URL] === this[PostKeys.VIDEO_URL].value &&
      post[PostKeys.PODCAST_EPISODE_URL] === this[PostKeys.PODCAST_EPISODE_URL].value &&
      post[PostKeys.DESCRIPTION] === this[PostKeys.DESCRIPTION].value &&
      post[PostKeys.KEYWORDS] === this[PostKeys.KEYWORDS].value &&
      post[PostKeys.CONTENT] === this[PostKeys.CONTENT].value &&
      !this.imagesModifiedSinceLastSave
    ) {
      return false;
    }
    return true;
  }

  private postIsBlank(): boolean {
    if (
      this.heroImageAdded ||
      this[PostKeys.TITLE].value ||
      this[PostKeys.VIDEO_URL].value ||
      this[PostKeys.PODCAST_EPISODE_URL].value ||
      this[PostKeys.DESCRIPTION].value ||
      this[PostKeys.KEYWORDS].value ||
      this[PostKeys.CONTENT].value ||
      this.imagesModifiedSinceLastSave
    ) {
      return false;
    }
    console.log('Post is blank');
    return true;
  }

  private readyToPublish(): boolean {
    if (
      !this.heroImageAdded ||
      this.postForm.invalid
    ) {
      console.log('Item not ready to activate');
      return false;
    }
    console.log('Item is ready to activate');
    return true;
  }

  private savePost(): void {
    this.adminUser$
      .pipe(take(1))
      .subscribe(publicUser => {
        const post: Post = {
          [PostKeys.BLOG_DOMAIN]: this[PostKeys.BLOG_DOMAIN].value,
          author: publicUser.displayName || publicUser.email,
          authorId: publicUser.id,
          [PostKeys.VIDEO_URL]: this[PostKeys.VIDEO_URL].value,
          [PostKeys.PODCAST_EPISODE_URL]: this[PostKeys.PODCAST_EPISODE_URL].value,
          [PostKeys.DESCRIPTION]: this[PostKeys.DESCRIPTION].value,
          [PostKeys.KEYWORDS]: this[PostKeys.KEYWORDS].value,
          [PostKeys.CONTENT]: this[PostKeys.CONTENT].value,
          modifiedDate: now(),
          [PostKeys.TITLE]: this[PostKeys.TITLE].value ? (this[PostKeys.TITLE].value as string).trim() : this.tempPostTitle,
          id: this.postId,
          readyToPublish: this.readyToPublish(),
          published: false,
          publishedDate: this.originalPost ? this.originalPost.publishedDate : null,
          imageProps: this.currentImageProps ? this.currentImageProps : null,
          featured: this.originalPost ? this.originalPost.featured : false
        };

        // If post isn't ready to publish, remove scheduled publish time
        if (!this.readyToPublish()) {
          post.scheduledPublishTime = null;
        }

        const postWrapper = post as Post; // Wrap partial post into post shell to play nice with store

        this.store$.dispatch(new PostStoreActions.UpdatePostRequested({post: postWrapper}));

        this.reactToSaveOutcome(post);
      });
  }

  private reactToSaveOutcome(post: Post) {
    this.savePostSubscription = this.store$.select(PostStoreSelectors.selectIsSaving)
      .pipe(
        withLatestFrom(
          this.store$.select(PostStoreSelectors.selectSaveError)
        )
      )
      .subscribe(([isSaving, saveError]) => {
        if (!isSaving && !saveError) {
          console.log('Post saved', post);
          this.imagesModifiedSinceLastSave = false; // Reset image change detection
          // Navigate to dashboard if save is complete and is a manual save
          if (this.manualSave || this.postDiscarded) {
            this.router.navigate([AdminAppRoutes.BLOG_DASHBOARD]);
          }
        }
        if (saveError) {
          console.log('Error saving coupon');
          this.postDiscarded = false;
        }
      });
  }

  private reactToDeletOutcome() {
    this.deletePostSubscription = this.store$.select(PostStoreSelectors.selectIsDeleting)
      .pipe(
        withLatestFrom(
          this.store$.select(PostStoreSelectors.selectDeleteError)
        )
      )
      .subscribe(([isDeleting, deleteError]) => {
        if (!isDeleting && !deleteError) {
          console.log('Post deleted', this.postId);
          // Navigate to dashboard if save is complete and is a manual save
          if (this.postDiscarded) {
            this.router.navigate([AdminAppRoutes.BLOG_DASHBOARD]);
          }
        }
        if (deleteError) {
          console.log('Error saving coupon');
          this.postDiscarded = false;
        }
      });
  }

  private killAutoSaveTicker(): void {
    clearInterval(this.autoSaveTicker);
  }

  private killInitPostTimeout(): void {
    clearTimeout(this.initPostTimeout);
  }

  get [PostKeys.BLOG_DOMAIN]() { return this.postForm.get(PostKeys.BLOG_DOMAIN); }
  get [PostKeys.TITLE]() { return this.postForm.get(PostKeys.TITLE); }
  get [PostKeys.VIDEO_URL]() { return this.postForm.get(PostKeys.VIDEO_URL); }
  get [PostKeys.PODCAST_EPISODE_URL]() { return this.postForm.get(PostKeys.PODCAST_EPISODE_URL); }
  get [PostKeys.DESCRIPTION]() { return this.postForm.get(PostKeys.DESCRIPTION); }
  get [PostKeys.KEYWORDS]() { return this.postForm.get(PostKeys.KEYWORDS); }
  get [PostKeys.CONTENT]() { return this.postForm.get(PostKeys.CONTENT); }

  ngOnDestroy(): void {
    if (this.postInitialized && !this.postDiscarded && !this.manualSave && !this.postIsBlank()) {
      this.savePost();
    }

    if (this.postInitialized && this.postIsBlank() && !this.postDiscarded) {
      console.log('Deleting blank post');
      this.store$.dispatch(new PostStoreActions.DeletePostRequested({postId: this.postId}));
    }

    if (this.autoSavePostSubscription) {
      this.autoSavePostSubscription.unsubscribe();
    }

    if (this.imageProcessingSubscription) {
      this.imageProcessingSubscription.unsubscribe();
    }

    if (this.autoSaveTicker) {
      this.killAutoSaveTicker();
    }

    if (this.initPostTimeout) {
      this.killInitPostTimeout();
    }

    if (this.savePostSubscription) {
      this.savePostSubscription.unsubscribe();
    }

    if (this.deletePostSubscription) {
      this.deletePostSubscription.unsubscribe();
    }
  }

}
