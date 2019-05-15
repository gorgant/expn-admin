import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageProps } from 'src/app/core/models/images/image-props.model';
import { Observable, Subscription, of, Subject, from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { take, withLatestFrom, map } from 'rxjs/operators';
import { InlineImageUploadAdapter } from 'src/app/core/utils/inline-image-upload-adapter';
import { Post } from 'src/app/core/models/posts/post.model';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors, PostStoreActions, PostStoreSelectors } from 'src/app/root-store';
import { AdminUser } from 'src/app/core/models/user/admin-user.model';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DeleteConfData } from 'src/app/core/models/forms-and-components/delete-conf-data.model';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { now } from 'moment';
import { ImageType } from 'src/app/core/models/images/image-type.model';
import { ImageService } from 'src/app/core/services/image.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnDestroy {

  publicUser$: Observable<AdminUser>;
  private post$: Observable<Post>;
  private postLoaded: boolean;
  heroImageProps$: Observable<ImageProps>;
  imageUploadProcessing$: Subject<boolean>;

  postForm: FormGroup;
  isNewPost: boolean;

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
  private imageProcessingSubscription: Subscription;

  public Editor = ClassicEditor;

  constructor(
    private store$: Store<RootStoreState.State>,
    private afs: AngularFirestore, // Used purely to generate ID
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private imageService: ImageService,
  ) { }

  ngOnInit() {

    this.configureNewPost();

    this.loadExistingPostData(); // Only loads if exists

    this.publicUser$ = this.store$.select(UserStoreSelectors.selectUser);

  }

  onSave() {
    this.manualSave = true;
    this.savePost();
    this.router.navigate([AppRoutes.BLOG_DASHBOARD]);
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
          this.router.navigate([AppRoutes.BLOG_DASHBOARD]);
          if (this.isNewPost) {
            this.store$.dispatch(new PostStoreActions.DeletePostRequested({postId: this.postId}));
          } else {
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

    // Initialize product if not yet done
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
        .pipe(take(1))
        .subscribe(post => {
          if (post) {
            const data = {
              title: post.title,
              videoUrl: post.videoUrl,
              content: post.content,
            };
            this.postForm.patchValue(data);
            this.heroImageProps$ = of(post.imageProps);
            if (post.imageProps) {
              this.heroImageAdded = true;
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
        this.store$.select(PostStoreSelectors.selectPostsLoaded)
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
      title: ['', Validators.required],
      videoUrl: [''],
      content: [{value: '', disabled: false }, Validators.required]
    });

    this.imageUploadProcessing$ = this.imageService.getImageProcessing(); // Monitor image processing
    this.setContentFormStatus();
    this.isNewPost = true;
    this.postId = this.afs.createId();
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
            return this.content.disable();
          case false:
            return this.content.enable();
          default:
            return this.content.enable();
        }
      });
  }

  private initializePost(): void {
    this.publicUser$
      .pipe(take(1))
      .subscribe(publicUser => {
        console.log('Post initialized');
        const data: Post = {
          author: publicUser.displayName || publicUser.id,
          authorId: publicUser.id,
          videoUrl: this.videoUrl.value,
          content: this.content.value,
          modifiedDate: now(),
          title: this.title.value ? this.title.value : this.tempPostTitle,
          id: this.postId
        };
        this.store$.dispatch(new PostStoreActions.AddPostRequested({post: data}));
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
    if (
      (post.title === this.title.value || post.title === this.tempPostTitle) &&
      post.content === this.content.value &&
      !this.imagesModifiedSinceLastSave
    ) {
      return false;
    }
    return true;
  }

  private postIsBlank(): boolean {
    if (
      this.heroImageAdded ||
      this.title.value ||
      this.videoUrl.value ||
      this.content.value ||
      this.imagesModifiedSinceLastSave
    ) {
      return false;
    }
    console.log('Post is blank');
    return true;
  }

  private savePost(): void {
    this.publicUser$
      .pipe(take(1))
      .subscribe(publicUser => {
        const post: Post = {
          author: publicUser.displayName || publicUser.id,
          authorId: publicUser.id,
          videoUrl: this.videoUrl.value,
          content: this.content.value,
          modifiedDate: now(),
          title: this.title.value ? this.title.value : this.tempPostTitle,
          id: this.postId
        };
        this.store$.dispatch(new PostStoreActions.UpdatePostRequested({post}));
        console.log('Post saved', post);
        this.imagesModifiedSinceLastSave = false; // Reset image change detection
      });
  }

  private killAutoSaveTicker(): void {
    clearInterval(this.autoSaveTicker);
  }

  private killInitPostTimeout(): void {
    clearTimeout(this.initPostTimeout);
  }

  get title() { return this.postForm.get('title'); }
  get videoUrl() { return this.postForm.get('videoUrl'); }
  get content() { return this.postForm.get('content'); }

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
  }

}
