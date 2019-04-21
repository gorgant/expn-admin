import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageProps } from 'src/app/core/models/images/image-props.model';
import { Observable, Subscription, of, Subject, from } from 'rxjs';
import { PostService } from 'src/app/core/services/post.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { InlineImageUploadAdapter } from 'src/app/core/utils/inline-image-upload-adapter';
import { Post } from 'src/app/core/models/posts/post.model';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors } from 'src/app/root-store';
import { AppUser } from 'src/app/core/models/user/app-user.model';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DeleteConfData } from 'src/app/core/models/forms-and-components/delete-conf-data.model';
import { DeleteConfirmDialogueComponent } from 'src/app/shared/components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { now } from 'moment';
import { ImageType } from 'src/app/core/models/images/image-type.model';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnDestroy {

  appUser$: Observable<AppUser>;
  postData$: Observable<Post>;
  heroImageProps$: Observable<ImageProps>;
  imageUploadProcessing$: Subject<boolean>;

  postForm: FormGroup;
  isNewPost: boolean;

  private postId: string;
  private tempPostTitle: string;
  private originalPost: Post;
  private postInitialized: boolean;
  private postDiscarded: boolean;
  private heroImageAdded: boolean; // Helps determine if post is blank
  private manualSave: boolean;

  private initPostTimeout: NodeJS.Timer;
  // Add "types": ["node"] to tsconfig.app.json to remove TS error from NodeJS.Timer function
  private autoSaveTicker: NodeJS.Timer;
  private autoSavePostSubscription: Subscription;
  private imageProcessingSubscription: Subscription;

  public Editor = ClassicEditor;

  constructor(
    private store$: Store<RootStoreState.State>,
    private postService: PostService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private imageService: ImageService
  ) { }

  ngOnInit() {

    this.configurePost();

    this.loadExistingPostData(); // Only loads if exists

    this.appUser$ = this.store$.select(UserStoreSelectors.selectAppUser);

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
            this.postService.deletePost(this.postId);
          } else {
            this.postData$
              .pipe(take(1))
              .subscribe(post => {
                const originalItemWithCurrentImageList: Post = {
                  ...this.originalPost,
                  imageFilePathList: post.imageFilePathList
                };
                console.log('Original post to revert to', this.originalPost);
                console.log('Original post with current image list', originalItemWithCurrentImageList);
                this.postService.updatePost(originalItemWithCurrentImageList);
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
    this.heroImageProps$ = from(this.imageService.uploadImageAndGetProps(file, this.postId, ImageType.BLOG_HERO));
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
      this.postData$ = this.postService.fetchSinglePost(this.postId);

      // If post data available, patch values into form
      this.postData$
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

  private configurePost() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      videoUrl: [''],
      content: [{value: '', disabled: false }, Validators.required]
    });

    this.imageUploadProcessing$ = this.imageService.getImageProcessing(); // Monitor image processing
    this.setContentFormStatus();
    this.isNewPost = true;
    this.postId = this.postService.generateNewPostId();
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
    this.appUser$
      .pipe(take(1))
      .subscribe(appUser => {
        console.log('Post initialized');
        const data: Post = {
          author: appUser.displayName || appUser.id,
          authorId: appUser.id,
          videoUrl: this.videoUrl.value,
          content: this.content.value,
          modifiedDate: now(),
          title: this.title.value ? this.title.value : this.tempPostTitle,
          id: this.postId
        };
        this.postService.createPost(data);
        this.postInitialized = true;
      });

  }

  private savePost(): void {
    this.appUser$
      .pipe(take(1))
      .subscribe(appUser => {
        const post: Post = {
          author: appUser.displayName || appUser.id,
          authorId: appUser.id,
          videoUrl: this.videoUrl.value,
          content: this.content.value,
          modifiedDate: now(),
          title: this.title.value ? this.title.value : this.tempPostTitle,
          id: this.postId
        };
        this.postService.updatePost(post);
      });
  }

  private createAutoSaveTicker() {
    console.log('Creating autosave ticker');
    // Set interval at 10 seconds
    const step = 10000;

    this.autoSavePostSubscription = this.postService.fetchSinglePost(this.postId)
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

  private killInitPostTimeout(): void {
    clearTimeout(this.initPostTimeout);
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

  private postIsBlank(): boolean {
    if (this.title.value || this.videoUrl.value || this.content.value || this.heroImageAdded) {
      return false;
    }
    console.log('Post is blank');
    return true;
  }

  ngOnDestroy(): void {
    if (this.postInitialized && !this.postDiscarded && !this.manualSave && !this.postIsBlank()) {
      this.savePost();
    }

    if (this.postInitialized && this.postIsBlank() && !this.postDiscarded) {
      console.log('Deleting blank post');
      this.postService.deletePost(this.postId);
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


  get title() { return this.postForm.get('title'); }
  get videoUrl() { return this.postForm.get('videoUrl'); }
  get content() { return this.postForm.get('content'); }

}
