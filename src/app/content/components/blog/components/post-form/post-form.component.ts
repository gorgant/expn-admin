import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription, of, Subject, from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { take, withLatestFrom, map, takeWhile, debounceTime, skipWhile, tap } from 'rxjs/operators';
import { InlineImageUploadAdapter } from 'src/app/core/utils/inline-image-upload-adapter';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Store } from '@ngrx/store';
import { RootStoreState, PostStoreActions, PostStoreSelectors, UserStoreSelectors } from 'src/app/root-store';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { now } from 'moment';
import { ImageService } from 'src/app/core/services/image.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AdminUser } from 'shared-models/user/admin-user.model';
import { Post, PostKeys } from 'shared-models/posts/post.model';
import { ImageProps } from 'shared-models/images/image-props.model';
import { POST_FORM_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import { BlogDomains } from 'shared-models/posts/blog-domains.model';
import { AdminAppRoutes, PublicAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { ImageType } from 'shared-models/images/image-type.model';
import { EditorSessionService } from 'src/app/core/services/editor-session.service';
import { SharedCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';
import { ActionConfData } from 'shared-models/forms-and-components/action-conf-data.model';
import { ActionConfirmDialogueComponent } from 'src/app/shared/components/action-confirm-dialogue/action-confirm-dialogue.component';
import { PostVars } from 'shared-models/posts/post-vars.model';
import { PODCAST_PATHS } from 'shared-models/podcast/podcast-vars.model';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnDestroy {

  appRoutes = PublicAppRoutes;

  adminUser$: Observable<AdminUser>;
  private post$: Observable<Post>;
  postLoaded: boolean;
  heroImageProps$: Observable<ImageProps>;
  imageUploadProcessing$: Subject<boolean>;

  postForm: FormGroup;
  postFormKeys = PostKeys;
  postValidationMessages = POST_FORM_VALIDATION_MESSAGES;
  descriptionMaxLength = PostVars.DESCRIPTION_MAX_LENGTH;
  keywordsMaxLength = PostVars.KEYWORDS_MAX_LENGTH;
  isNewPost: boolean;
  loadingExistingPost: boolean;

  blogDomains: string[] = Object.values(BlogDomains);

  private postId: string;
  private tempPostTitle: string;
  private originalPost: Post;
  postInitialized: boolean;
  postTouched: boolean;
  private postDiscarded: boolean;
  private heroImageAdded: boolean; // Helps determine if post is blank
  private manualSave: boolean;

  private savePostSubscription: Subscription;
  isSavingPost$: Observable<boolean>;
  private deletePostSubscription: Subscription;
  isDeletingPost$: Observable<boolean>;
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
    private editorSessionService: EditorSessionService
  ) { }

  ngOnInit() {
    this.configureNewPost();
    this.loadExistingPostData(); // Only loads if exists
    this.adminUser$ = this.store$.select(UserStoreSelectors.selectUser);
    this.monitorFormChanges();
  }

  private createEditorSession(docId: string) {
    this.editorSessionService.createEditorSession(docId, SharedCollectionPaths.POSTS);
  }

  private updateEditorSession() {
    this.editorSessionService.updateEditorSession();
  }

  // Keeps track of user changes and triggers auto save
  private monitorFormChanges() {
    this.postForm.valueChanges
      .pipe(
        skipWhile(() => this.loadingExistingPost), // Prevents this from firing when patching in existing data
        debounceTime(1000)
      )
      .subscribe(valueChange => {
        console.log('Logging form value change', valueChange);
        if (!this.postInitialized) {
          this.initializePost();
        }
        this.postForm.markAsTouched(); // Edits in the text editor don't automatically cause form to be touched until clicking out
        this.savePost();
      });
  }

  onSave() {
    this.manualSave = true;
    this.savePost();
  }

  onDiscardEdits() {
    const dialogConfig = new MatDialogConfig();

    const deleteConfData: ActionConfData = {
      title: 'Discard Edits',
      body: 'Are you sure you want to discard your edits?'
    };

    dialogConfig.data = deleteConfData;

    const dialogRef = this.dialog.open(ActionConfirmDialogueComponent, dialogConfig);

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
          // If existing item, revert to original version (but user current image list)
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
                console.log('Reverting to original item with current image list', originalItemWithCurrentImageList);
                this.store$.dispatch(new PostStoreActions.RollbackPostRequested({post: originalItemWithCurrentImageList}));
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

      if (!this.postInitialized) {
        this.initializePost(); // Initialize post so that it exists once image is uploaded
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
    }

    // Upload file and get image props
    this.heroImageProps$ = from(
      this.imageService.uploadImageAndGetProps(file, this.postId, ImageType.BLOG_HERO)
        .then(imageProps => {
          this.heroImageAdded = true;
          this.currentImageProps = imageProps;
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
      this.loadingExistingPost = true; // Pauses the monitorChanges observable
      this.postInitialized = true; // Prevents post from being initialized (which would overwrite this data)
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
              [PostKeys.TITLE]: post[PostKeys.TITLE],
              [PostKeys.VIDEO_URL]: post[PostKeys.VIDEO_URL] ? post[PostKeys.VIDEO_URL] : '',
              [PostKeys.PODCAST_EPISODE_URL]: post[PostKeys.PODCAST_EPISODE_URL] ? post[PostKeys.PODCAST_EPISODE_URL] : '',
              [PostKeys.DESCRIPTION]: post[PostKeys.DESCRIPTION],
              [PostKeys.KEYWORDS]: post[PostKeys.KEYWORDS],
              [PostKeys.CONTENT]: post[PostKeys.CONTENT],
            };
            // Patch in form values
            console.log('Patching post data into form', data);
            this.postForm.patchValue(data);
            this.heroImageProps$ = of(post.imageProps);
            if (post.imageProps) {
              this.heroImageAdded = true;
              this.currentImageProps = post.imageProps;
            }
            this.isNewPost = false;
            this.originalPost = post;
            this.createEditorSession(post.id); // Trigger the start of this editing session
            this.loadingExistingPost = false; // unpauses the monitorChanges observable
          }
      });
    }
  }

  private getPost(postId: string): Observable<Post> {
    console.log('Getting post', postId);
    return this.store$.select(PostStoreSelectors.selectPostById(postId))
    .pipe(
      withLatestFrom(
        this.store$.select(PostStoreSelectors.selectPostsLoaded)
      ),
      map(([post, postsLoaded]) => {
        // Check if items are loaded, if not fetch from server
        if (!postsLoaded && !this.postLoaded) {
          console.log('No post in store, fetching from server', postId);
          this.store$.dispatch(new PostStoreActions.SinglePostRequested({postId}));
        }
        this.postLoaded = true; // Prevents loading from firing more than needed
        return post;
      })
    );
  }

  private configureNewPost() {
    this.isNewPost = true;
    this.postId = `${this.utilsService.generateRandomCharacterNoCaps(8)}`; // Use custom ID creator to avoid caps in URLs
    this.tempPostTitle = `Untitled Post ${this.postId.substr(0, 4)}`;

    this.postForm = this.fb.group({
      [PostKeys.BLOG_DOMAIN]: [BlogDomains.EXPN, Validators.required],
      [PostKeys.TITLE]: ['', Validators.required],
      [PostKeys.VIDEO_URL]: ['', [Validators.pattern(/^\S*(?:https\:\/\/youtu\.be)\S*$/)]],
      [PostKeys.PODCAST_EPISODE_URL]: ['', [Validators.pattern(/^\S*(?:https\:\/\/podcasters\.spotify\.com\/pod\/show\/)\S*$/)]],
      [PostKeys.DESCRIPTION]: ['', [Validators.required, Validators.maxLength(this.descriptionMaxLength)]],
      [PostKeys.KEYWORDS]: ['', [Validators.required, Validators.maxLength(this.keywordsMaxLength)]],
      [PostKeys.CONTENT]: [{value: '', disabled: false }, Validators.required],
    });

    this.imageUploadProcessing$ = this.imageService.getImageProcessing(); // Monitor image processing
    this.lockFormWhileImageProcessing();
  }

  // Prevents editing of content while image upload is processing
  private lockFormWhileImageProcessing(): void {
    this.imageProcessingSubscription = this.imageUploadProcessing$
      .subscribe(imageProcessing => imageProcessing ? this[PostKeys.CONTENT].disable() : this[PostKeys.CONTENT].enable());
  }

  // Won't fire if this is not a new post
  private initializePost(): void {
    this.adminUser$
      .pipe(take(1))
      .subscribe(adminUser => {
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
        console.log('Post initialized');
        this.createEditorSession(this.postId);
      });
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
          author: publicUser.displayName ?? publicUser.email,
          authorId: publicUser.id,
          [PostKeys.VIDEO_URL]: this[PostKeys.VIDEO_URL].value,
          [PostKeys.PODCAST_EPISODE_URL]: this[PostKeys.PODCAST_EPISODE_URL].value,
          [PostKeys.PODCAST_ANCHOR_RSS_FEED_URL]: `${PODCAST_PATHS.expn.anchorRssFeedEpisodeUrl}/${this[PostKeys.PODCAST_EPISODE_URL].value.split('/').pop()}`, // This is needed until the RSS feed adopts the new spotify url format
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
          featured: this.originalPost ? (this.originalPost.featured ? this.originalPost.featured : false) : false
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
        ),
        tap(([isSaving, saveError]) => {
          this.isSavingPost$ = of(isSaving);
        })
      )
      .subscribe(([isSaving, saveError]) => {
        console.log('React to save outcome subscription firing');
        if (!isSaving && !saveError) {
          console.log('Post saved', post);
          // Navigate to dashboard if save is complete and is a manual save
          if (this.manualSave || this.postDiscarded) {
            this.router.navigate([AdminAppRoutes.BLOG_DASHBOARD]);
          } else {
            this.updateEditorSession(); // update editor session if no navigation
          }
          this.savePostSubscription.unsubscribe();
        }
        if (saveError) {
          console.log('Error saving coupon');
          this.postDiscarded = false;
          this.savePostSubscription.unsubscribe();
        }
      });
  }

  private reactToDeletOutcome() {
    this.deletePostSubscription = this.store$.select(PostStoreSelectors.selectIsDeleting)
      .pipe(
        withLatestFrom(
          this.store$.select(PostStoreSelectors.selectDeleteError)
        ),
        tap(([isDeleting, deleteError]) => {
          this.isDeletingPost$ = of(isDeleting);
        })
      )
      .subscribe(([isDeleting, deleteError]) => {
        if (!isDeleting && !deleteError) {
          console.log('Post deleted', this.postId);
          // Navigate to dashboard if save is complete and is a manual save
          if (this.postDiscarded) {
            this.router.navigate([AdminAppRoutes.BLOG_DASHBOARD]);
          }
          this.deletePostSubscription.unsubscribe();
        }
        if (deleteError) {
          console.log('Error deleting post');
          this.postDiscarded = false;
          this.deletePostSubscription.unsubscribe();
        }
      });
  }

  get [PostKeys.BLOG_DOMAIN]() { return this.postForm.get(PostKeys.BLOG_DOMAIN); }
  get [PostKeys.TITLE]() { return this.postForm.get(PostKeys.TITLE); }
  get [PostKeys.VIDEO_URL]() { return this.postForm.get(PostKeys.VIDEO_URL); }
  get [PostKeys.PODCAST_EPISODE_URL]() { return this.postForm.get(PostKeys.PODCAST_EPISODE_URL); }
  get [PostKeys.DESCRIPTION]() { return this.postForm.get(PostKeys.DESCRIPTION); }
  get [PostKeys.KEYWORDS]() { return this.postForm.get(PostKeys.KEYWORDS); }
  get [PostKeys.CONTENT]() { return this.postForm.get(PostKeys.CONTENT); }

  ngOnDestroy(): void {

    this.editorSessionService.destroyComponentActions(); // Signals unsubscribe in service from all relevant subscriptions

    // Save post when user navigates away without saving manually
    if (
        this.postInitialized &&
        !this.postDiscarded &&
        !this.manualSave &&
        this.postForm.touched &&
        !this.editorSessionService.autoDisconnectDetected
      ) {
      this.savePost();
    }

    if (this.imageProcessingSubscription) {
      this.imageProcessingSubscription.unsubscribe();
    }

    if (this.savePostSubscription) {
      this.savePostSubscription.unsubscribe();
    }

    if (this.deletePostSubscription) {
      this.deletePostSubscription.unsubscribe();
    }
  }

}
