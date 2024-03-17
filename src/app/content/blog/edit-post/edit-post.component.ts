import { Component, HostListener, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, catchError, combineLatest, debounceTime, distinctUntilChanged, filter, map, of, switchMap, take, tap, throwError, withLatestFrom } from 'rxjs';
import { Post, PostFormVars, PostKeys, SPOTIFY_PODCAST_EPISODE_URL_VALIDATION_REGEX, YOUTUBE_VIDEO_URL_VALIDATION_REGEX } from '../../../../../shared-models/posts/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../../core/services/ui.service';
import { PostStoreActions, PostStoreSelectors, UserStoreSelectors } from '../../../root-store';
import { AdminUser, AdminUserKeys } from '../../../../../shared-models/user/admin-user.model';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminAppRoutes } from '../../../../../shared-models/routes-and-paths/app-routes.model';
import { BlogDomains } from '../../../../../shared-models/posts/blog-domains.model';
import { DateTime } from 'luxon';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ProcessingSpinnerComponent } from "../../../shared/components/processing-spinner/processing-spinner.component";
import { ImageUploaderComponent } from "./image-uploader/image-uploader.component";
import { AdminImagePaths } from '../../../../../shared-models/routes-and-paths/image-paths.model';
import { HelperService } from '../../../core/services/helpers.service';
import { CanDeactivateData } from '../../../../../shared-models/forms/can-deactivate-data.model';
import { GlobalFieldValues } from '../../../../../shared-models/content/string-vals.model';
import { SocialUrlPrefixes } from '../../../../../shared-models/meta/social-urls.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP, DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE } from '../../../../../shared-models/user-interface/dialogue-box-default-config.model';
import { ActionConfData } from '../../../../../shared-models/forms/action-conf-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ActionConfirmDialogueComponent } from '../../../shared/components/action-confirm-dialogue/action-confirm-dialogue.component';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
    selector: 'app-edit-post',
    standalone: true,
    templateUrl: './edit-post.component.html',
    styleUrl: './edit-post.component.scss',
    imports: [AsyncPipe, MatButtonModule, ProcessingSpinnerComponent, ImageUploaderComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, CdkTextareaAutosize, CKEditorModule]
})
export class EditPostComponent implements OnInit, OnDestroy {

  public Editor = ClassicEditor; // See https://ckeditor.com/docs/ckeditor5/latest/installation/integrations/angular.html for installation instructions
  
  DISCARD_EDITS_TITLE_VALUE = GlobalFieldValues.DISCARD_EDITS_TITLE;
  DISCARD_EDITS_BODY_VALUE = GlobalFieldValues.DISCARD_EDITS_BODY;
  DISCARD_EDITS_BUTTON_VALUE = GlobalFieldValues.DISCARD_EDITS_TITLE;
  EDIT_POST_PAGE_HEADER = GlobalFieldValues.EDIT_POST;

  PODCAST_EPISODE_URL_FIELD_VALUE = GlobalFieldValues.PODCAST_EPISODE_URL;
  POST_DESCRIPTION_FIELD_VALUE = GlobalFieldValues.POST_DESCRIPTION;
  POST_KEYWORDS_FIELD_VALUE = GlobalFieldValues.POST_KEYWORDS;
  POST_TITLE_FIELD_VALUE = GlobalFieldValues.POST_TITLE;
  SUBMIT_BUTTON_VALUE = GlobalFieldValues.SUBMIT;
  VIDEO_URL_FIELD_VALUE = GlobalFieldValues.VIDEO_URL;

  DESCRIPTION_MAX_LENGTH = PostFormVars.descriptionMaxLength;
  KEYWORDS_MAX_LENGTH = PostFormVars.keywordsMaxLength;
  TITLE_MAX_LENGTH = PostFormVars.titleMaxLength;
  TITLE_MIN_LENGTH = PostFormVars.titleMinLength;

  private postEditor = viewChild<CKEditorComponent>('postEditor');

  userData$!: Observable<AdminUser>;

  private $createPostCycleComplete = signal(false);
  private $createPostCycleInit = signal(false);
  private $createPostSubmitted = signal(false);
  private createPostError$!: Observable<{} | null>;
  private createPostProcessing$!: Observable<boolean>;
  private createPostSubscription!: Subscription;

  private $fetchSinglePostSubmitted = signal(false);
  private fetchSinglePostError$!: Observable<{} | null>;
  private fetchSinglePostProcessing$!: Observable<boolean>;
  private fetchSinglePostSubscription!: Subscription;

  $discardEditsRequested = signal(false);
  private $updatePostCycleComplete = signal(false);
  private $updatePostCycleInit = signal(false);
  private $updatePostSubmitted = signal(false);
  updatePostProcessing$!: Observable<boolean>;
  private updatePostSubscription!: Subscription;
  private updatePostError$!: Observable<{} | null>;

  private autoSaveSubscription!: Subscription;

  $localPost = signal(undefined as Post | undefined);
  $localPostId = signal(undefined as string | undefined);
  $originalPost = signal(undefined as Post | undefined);

  $isNewPost = signal(false);

  $formInitialized = signal(false);

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store$ = inject(Store);
  private uiService = inject(UiService);
  private helperService = inject(HelperService);
  private dialog = inject(MatDialog);

  postForm = this.fb.group({
    [PostKeys.CONTENT]: ['', [Validators.required]],
    [PostKeys.DESCRIPTION]: ['', [Validators.required, Validators.maxLength(this.DESCRIPTION_MAX_LENGTH)]],
    [PostKeys.KEYWORDS]: ['', [Validators.required, Validators.maxLength(this.KEYWORDS_MAX_LENGTH)]],
    [PostKeys.PODCAST_EPISODE_URL]: ['', [Validators.required, Validators.pattern(SPOTIFY_PODCAST_EPISODE_URL_VALIDATION_REGEX)]],
    [PostKeys.TITLE]: ['', [Validators.required, Validators.minLength(this.TITLE_MIN_LENGTH), Validators.maxLength(this.TITLE_MAX_LENGTH)]],
    [PostKeys.VIDEO_URL]: ['', [Validators.required, Validators.pattern(YOUTUBE_VIDEO_URL_VALIDATION_REGEX)]],
  });
  

  ngOnInit(): void {
    this.monitorProcesses();
    this.configurePostInterface();
    
  }

  private monitorProcesses() {
    
    this.createPostError$ = this.store$.select(PostStoreSelectors.selectCreatePostError);
    this.createPostProcessing$ = this.store$.select(PostStoreSelectors.selectCreatePostProcessing);

    this.fetchSinglePostError$ = this.store$.select(PostStoreSelectors.selectFetchSinglePostError);
    this.fetchSinglePostProcessing$ = this.store$.select(PostStoreSelectors.selectFetchSinglePostProcessing);

    this.updatePostError$ = this.store$.select(PostStoreSelectors.selectUpdatePostError);
    this.updatePostProcessing$ = this.store$.select(PostStoreSelectors.selectUpdatePostProcessing);

    this.userData$ = this.store$.select(UserStoreSelectors.selectAdminUserData) as Observable<AdminUser>;

  }

  get contentErrorMessage() {
    let errorMessage = '';
    if (this.content.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    return errorMessage;
  }

  get descriptionErrorMessage() {
    let errorMessage = '';
    if (this.description.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    if (this.description.hasError('maxLength')) {
      return errorMessage = `Length cannot exceed ${this.DESCRIPTION_MAX_LENGTH} characters`;
    }
    return errorMessage;
  }

  get keywordsErrorMessage() {
    let errorMessage = '';
    if (this.keywords.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    if (this.keywords.hasError('maxLength')) {
      return errorMessage = `Length cannot exceed ${this.KEYWORDS_MAX_LENGTH} characters`;
    }
    return errorMessage;
  }

  get podcastEpisodeUrlErrorMessage() {
    let errorMessage = '';
    if (this.podcastEpisodeUrl.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    if (this.podcastEpisodeUrl.hasError('pattern')) {
      return errorMessage = `Podcast url must begin with '${SocialUrlPrefixes.SPOTIFY_PODCAST}'`;
    }
    return errorMessage;
  }

  get titleErrorMessage() {
    let errorMessage = '';
    if (this.title.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    if (this.title.hasError('maxLength')) {
      return errorMessage = `Length cannot exceed ${this.TITLE_MAX_LENGTH} characters`;
    }
    if (this.title.hasError('minLength')) {
      return errorMessage = `Length must be at least ${this.TITLE_MIN_LENGTH} characters`;
    }
    return errorMessage;
  }

  get videoUrlErrorMessage() {
    let errorMessage = '';
    if (this.videoUrl.hasError('required')) {
      return errorMessage = 'You must enter a value';
    }
    if (this.videoUrl.hasError('pattern')) {
      return errorMessage = `Video url must begin with '${SocialUrlPrefixes.YOUTUBE_VIDEO}' or '${SocialUrlPrefixes.YOUTUBE_VIDEO_LONG}'`;
    }
    return errorMessage;
  }

  private configurePostInterface(): void {
    this.setPostId();
    const postId = this.$localPostId();
    if (postId) {
      console.log('Existing post detected, patching existing data');
      this.patchExistingPostDataIntoPostForm(postId)
      this.initializeFormAutosave();
    } else {
      console.log('New post detected, configuring new post');
      this.configureNewPost();
    }
  }

  private setPostId() {
    const postId = this.route.snapshot.paramMap.get(PostKeys.ID) as string | undefined;
    console.log('Extracted this postID', postId);
    if (postId) {
      this.$localPostId.set(postId);
    }
  }

  private configureNewPost() {
    this.$isNewPost.set(true);
    this.initializeNewPost();
  }

  // Create a new partial post and navigate to that to begin editing
  private initializeNewPost() {
    const newPostId = this.helperService.generateRandomCharacterNoCaps(8);
    this.createPostSubscription = this.createPostError$
      .pipe(
        switchMap(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating dialog');
            this.resetCreatePostComponentState();
            this.navigateToHome();
          }
          return this.userData$;
        }),
        withLatestFrom(this.createPostError$),
        filter(([userData, processingError]) => !processingError), // Halts function if processingError detected
        switchMap(([userData, processingError]) => {
          if (!this.$createPostSubmitted()) {
            this.$createPostSubmitted.set(true);

            const newPost: Post = {
              [PostKeys.AUTHOR_ID]: userData[AdminUserKeys.ID],
              [PostKeys.AUTHOR_NAME]: userData[AdminUserKeys.DISPLAY_NAME] || userData[AdminUserKeys.EMAIL],
              [PostKeys.BLOG_DOMAIN]: BlogDomains.EXPN,
              [PostKeys.CONTENT]: '',
              [PostKeys.CREATED_TIMESTAMP]: DateTime.now().toMillis(),
              [PostKeys.DESCRIPTION]: '',
              [PostKeys.FEATURED]: false,
              [PostKeys.HERO_IMAGES]: {
                imageUrlLarge: AdminImagePaths.HERO_PLACEHOLDER,
                imageUrlSmall: AdminImagePaths.HERO_PLACEHOLDER,
              },
              [PostKeys.ID]: newPostId,
              [PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP]: null,
              [PostKeys.KEYWORDS]: '',
              [PostKeys.LAST_MODIFIED_TIMESTAMP]: DateTime.now().toMillis(),
              [PostKeys.LAST_MODIFIED_USER_ID]: userData[AdminUserKeys.ID],
              [PostKeys.LAST_MODIFIED_USER_NAME]: userData[AdminUserKeys.DISPLAY_NAME] || userData[AdminUserKeys.EMAIL],
              [PostKeys.PODCAST_EPISODE_URL]: '',
              [PostKeys.PUBLISHED]: false,
              [PostKeys.PUBLISHED_TIMESTAMP]: null,
              [PostKeys.READY_TO_PUBLISH]: false,
              [PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP]: null,
              [PostKeys.TITLE]: `Untitled Post - ${DateTime.now().toMillis()}`,
              [PostKeys.VIDEO_URL]: '',
            };
            this.store$.dispatch(PostStoreActions.createPostRequested({post: newPost}));
          }
          return this.createPostProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(createProcessing => {
          if (createProcessing) {
            this.$createPostCycleInit.set(true);
          }
          if (!createProcessing && this.$createPostCycleInit()) {
            console.log('createPost successful, proceeding with pipe.');
            this.$createPostCycleInit.set(false);
            this.$createPostCycleComplete.set(true);
          }
        }),
        filter(createProcessing => !createProcessing && this.$createPostCycleComplete()),
        tap(createProcessing => {
          this.uiService.showSnackBar(`Post Initialized!`, 5000);
          this.resetCreatePostComponentState();
          this.navigateToEditPost(newPostId);
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetCreatePostComponentState();
          this.navigateToHome();
          return throwError(() => new Error(error));
        })
      ).subscribe();
  
  }

  private resetCreatePostComponentState() {
    this.createPostSubscription?.unsubscribe();
    this.$createPostSubmitted.set(false);
    this.$createPostCycleInit.set(false);
    this.$createPostCycleComplete.set(false);
    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
  }

  private navigateToEditPost(postId: string) {
    console.log('Routing to blog with this id', postId);
    this.router.navigate([AdminAppRoutes.BLOG_EDIT_POST, postId]);
  }

  private patchExistingPostDataIntoPostForm(postId: string) {
    const singlePost$ = this.store$.select(PostStoreSelectors.selectPostById(postId));
    
    this.fetchSinglePostSubscription = this.fetchSinglePostError$
      .pipe(
        switchMap(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe', processingError);
            this.resetPatchExistingPostDataInPostFormComponentState();
            this.navigateToHome();
          }
          return singlePost$;
        }),
        withLatestFrom(this.fetchSinglePostError$),
        filter(([post, processingError]) => !processingError),
        map(([post, processingError]) => {
          // Normally this if statement will check for the post from the map, but here we exclude that check bc we want to force the fetch here to fix a refresh bug if creating a post
          if (!this.$fetchSinglePostSubmitted()) {
            this.$fetchSinglePostSubmitted.set(true);
            console.log(`post ${postId} not yet fetched, fetching from database`);
            this.store$.dispatch(PostStoreActions.fetchSinglePostRequested({postId}));
          }
          return post;
        }),
        filter(post => !!post),
        tap(post => {
          const postData = post as Post;
          
          // Store the original version in case changes are discarded
          if (postData && !this.$originalPost()) {
            this.$originalPost.set(postData); 
            console.log('No originalPost exists, setting that now', post);
          }

          const serverPostAndLocalPostAreEqual = this.helperService.verifyObjectsAreEqual(post, this.$localPost());
          console.log('serverPost and localPost are equal', serverPostAndLocalPostAreEqual);

          const serverFormData = {
            [PostKeys.CONTENT]: postData[PostKeys.CONTENT],
            [PostKeys.DESCRIPTION]: postData[PostKeys.DESCRIPTION],
            [PostKeys.KEYWORDS]: postData[PostKeys.KEYWORDS],
            [PostKeys.PODCAST_EPISODE_URL]: postData[PostKeys.PODCAST_EPISODE_URL],
            [PostKeys.TITLE]: postData[PostKeys.TITLE],
            [PostKeys.VIDEO_URL]: postData[PostKeys.VIDEO_URL],
          };

          const localFormData = {
            [PostKeys.CONTENT]: this.$localPost() ? this.$localPost()![PostKeys.CONTENT]: null,
            [PostKeys.DESCRIPTION]: this.$localPost() ? this.$localPost()![PostKeys.DESCRIPTION]: null,
            [PostKeys.KEYWORDS]: this.$localPost() ? this.$localPost()![PostKeys.KEYWORDS]: null,
            [PostKeys.PODCAST_EPISODE_URL]: this.$localPost() ? this.$localPost()![PostKeys.PODCAST_EPISODE_URL]: null,
            [PostKeys.TITLE]: this.$localPost() ? this.$localPost()![PostKeys.TITLE]: null,
            [PostKeys.VIDEO_URL]: this.$localPost() ? this.$localPost()![PostKeys.VIDEO_URL]: null,
          };

          const serverFormDataAndLocalFormDataAreEqual = this.helperService.verifyObjectsAreEqual(serverFormData, localFormData);
          console.log('serverFormData and localFormData are equal', serverFormDataAndLocalFormDataAreEqual);

          // Update the local post if either there is no local post or if it doesn't match the server
          if (post && !this.$localPost()) {
            console.log('No localPost exists, setting that now', post);
            this.$localPost.set(post);
          } else if (post && !serverPostAndLocalPostAreEqual) {
            console.log('serverPost does not match local post, updating local post');
            this.$localPost.set(postData);
          }

          // Separate from the localPost, this ensures the form is only updated at initialization or when the post is updated remotely (which prevents the cursor from jumping to the start of the text box if updated)
          if (!serverFormDataAndLocalFormDataAreEqual || !this.$formInitialized()) {
            this.$formInitialized.set(true);
            this.content.setValue(postData[PostKeys.CONTENT] ? postData[PostKeys.CONTENT] : 'Time to write!');
            this.description.setValue(postData[PostKeys.DESCRIPTION]);
            this.keywords.setValue(postData[PostKeys.KEYWORDS]);
            this.podcastEpisodeUrl.setValue(postData[PostKeys.PODCAST_EPISODE_URL] ? postData[PostKeys.PODCAST_EPISODE_URL] : '');
            this.title.setValue(postData[PostKeys.TITLE]);
            this.videoUrl.setValue(postData[PostKeys.VIDEO_URL] ? postData[PostKeys.VIDEO_URL] : '');

            console.log('Patched serverFormData into postFormData', this.postForm.value);
          }

        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetPatchExistingPostDataInPostFormComponentState();
          this.navigateToHome();
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }

  private resetPatchExistingPostDataInPostFormComponentState() {
    this.fetchSinglePostSubscription?.unsubscribe();
    this.$fetchSinglePostSubmitted.set(false);
    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
  }

  onSubmitPostForm(): void {
    this.updateExistingPost(false, false);
  }

  private updateExistingPost(revertToOriginal: boolean, isAutoSave: boolean) {
    this.updatePostSubscription = this.updatePostError$
      .pipe(
        map(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe');
            this.resetUpdateExistingPostComponentState();
          }
          return processingError;
        }),
        filter(processingError => !processingError), // Halts function if processingError detected
        withLatestFrom(this.userData$),
        switchMap(([processingError, userData]) => {
          if (!this.$updatePostSubmitted()) {
            this.$updatePostSubmitted.set(true);

            if (!revertToOriginal) {
             this.dispatchPostUpdates(userData);
            } else {
              this.store$.dispatch(PostStoreActions.updatePostRequested({postUpdates: this.$originalPost() as Post}));
            }


          }
          this.postForm.disable(); // Make sure to check for form validity (i.e., readyToPublish()) BEFORE disabling the form because disabling seems to trigger the invalid state
          return this.updatePostProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(updateProcessing => {
          if (updateProcessing) {
            this.$updatePostCycleInit.set(true);
          }
          if (!updateProcessing && this.$updatePostCycleInit()) {
            console.log('updatePost successful, proceeding with pipe.');
            this.$updatePostCycleInit.set(false);
            this.$updatePostCycleComplete.set(true);
          }
        }),
        filter(updateProcessing => !updateProcessing && this.$updatePostCycleComplete()),
        tap(updateProcessing => {
          this.updatePostSubscription?.unsubscribe();
          if (this.$discardEditsRequested()) {
            this.uiService.showSnackBar(`Edits discarded!`, 5000);
          } else {
            this.uiService.showSnackBar(`Post updated!`, 5000);
          }
          if (!isAutoSave) {
            this.navigateToHome();
          }
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetUpdateExistingPostComponentState();
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }

  private resetUpdateExistingPostComponentState() {
    this.updatePostSubscription?.unsubscribe();
    this.$updatePostSubmitted.set(false);
    this.$updatePostCycleInit.set(false);
    this.$updatePostCycleComplete.set(false);
    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
    this.postForm.enable();
  }

  // Separate this out because it is used in both normal updates and autosaves
  private getPendingPostUpdates(userData: AdminUser): Post {
    const postUpdates = {
      ...this.$localPost() as Post,
      [PostKeys.CONTENT]: this.content.value,
      [PostKeys.DESCRIPTION]: this.description.value,
      [PostKeys.KEYWORDS]: this.keywords.value,
      [PostKeys.LAST_MODIFIED_USER_ID]: userData[AdminUserKeys.ID],
      [PostKeys.LAST_MODIFIED_USER_NAME]: userData[AdminUserKeys.DISPLAY_NAME] || userData[AdminUserKeys.EMAIL],
      [PostKeys.PODCAST_EPISODE_URL]: this.podcastEpisodeUrl.value,
      [PostKeys.READY_TO_PUBLISH]: this.readyToPublish(),
      [PostKeys.TITLE]: this.title.value,
      [PostKeys.VIDEO_URL]: this.videoUrl.value,
    };

    // If post isn't ready to publish, remove scheduled publish time
    if (!this.readyToPublish()) {
      postUpdates[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP] = null;
    }

    return postUpdates;
  }

  // Separate this out because it is used in both normal updates and autosaves
  private dispatchPostUpdates(userData: AdminUser) {
    const postUpdates = {
      ...this.getPendingPostUpdates(userData),
      [PostKeys.LAST_MODIFIED_TIMESTAMP]: DateTime.now().toMillis(), // Defer update until dispatch to ensure this doesn't falsely trigger autosaves
    };

    // If post isn't ready to publish, remove scheduled publish time
    if (!this.readyToPublish()) {
      postUpdates[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP] = null;
    }

    this.$localPost.set(postUpdates); // Updating the local post prevents the editor from getting reset once the updates are fetched from the server after saving

    this.store$.dispatch(PostStoreActions.updatePostRequested({postUpdates}));
  }

  private initializeFormAutosave() {

    const singlePost$ = this.store$.select(PostStoreSelectors.selectPostById(this.$localPostId()!));

    this.autoSaveSubscription = this.postForm.valueChanges.pipe(
      debounceTime(5000),
      withLatestFrom(this.userData$, singlePost$),
      switchMap(([formValue, userData, serverPost]) => {
        const pendingPostUpdates = this.getPendingPostUpdates(userData);
        const serverPostAndLocalPostAreEqual = this.helperService.verifyObjectsAreEqual(serverPost, pendingPostUpdates);
        console.log('serverPost and pendingPostUpdates are equal', serverPostAndLocalPostAreEqual);
        if (serverPostAndLocalPostAreEqual) {
          return of();
        }
        console.log('Triggering autosave', formValue);
        return of(this.dispatchPostUpdates(userData));
      })
    ).subscribe();
  }

  // Check if user wants to discard changes
  onDiscardChanges() {
    if (this.formIsClean()) {
      console.log('Form is clean, no changes to discard');
      this.navigateToHome();
      return;
    }
    let dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE};
    if (!this.uiService.$screenIsMobile()) {
      dialogConfig = {...DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP};
    }
    const actionConfData: ActionConfData = {
      title: this.DISCARD_EDITS_TITLE_VALUE,
      body: this.DISCARD_EDITS_BODY_VALUE,
    };

    dialogConfig.data = actionConfData;
    
    const dialogRef = this.dialog.open(ActionConfirmDialogueComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((confirmedDiscard: boolean) => {
        if (confirmedDiscard)
          this.updateExistingPost(true, false);
          this.$discardEditsRequested.set(true);
        })
  }

  private readyToPublish(): boolean {
    const postFormIsValid = this.postForm.valid;
    const postHasHeroImage = !!this.$localPost() && !!this.$localPost()![PostKeys.HERO_IMAGES];
    return postFormIsValid && postHasHeroImage;
  }

  private navigateToHome() {
    this.router.navigate([AdminAppRoutes.HOME]);
  }

  private formIsClean(): boolean {
    const imageUnchanged = this.$originalPost()![PostKeys.HERO_IMAGES].imageUrlSmall === this.$localPost()![PostKeys.HERO_IMAGES].imageUrlSmall;
    console.log('imageUnchanged', imageUnchanged);
    const formIsClean = !this.content?.touched && !this.content?.dirty && 
                        !this.description?.touched && !this.description?.dirty && 
                        !this.keywords?.touched && !this.keywords?.dirty && 
                        !this.title?.touched && !this.title?.dirty && 
                        !this.videoUrl?.touched && !this.videoUrl?.dirty &&
                        !this.podcastEpisodeUrl?.touched && !this.podcastEpisodeUrl?.dirty &&
                        imageUnchanged;

    return formIsClean;
  }

  // @HostListener allows us to also CanDeactivate Guard against browser refresh, close, etc.
  @HostListener('window:beforeunload') canDeactivate(): Observable<CanDeactivateData> | CanDeactivateData {
    // If form untouched, allow user to navigate freely
    const createdOrUpdatedPost = this.$updatePostSubmitted() || this.$createPostSubmitted();

    const canDeactivateData: CanDeactivateData = {
      deactivationPermitted: this.formIsClean() || createdOrUpdatedPost,
      warningMessage: {
        title: this.DISCARD_EDITS_TITLE_VALUE,
        body: this.DISCARD_EDITS_BODY_VALUE
      }
    }

    return canDeactivateData;
  }

  ngOnDestroy(): void {
    this.createPostSubscription?.unsubscribe();
    this.fetchSinglePostSubscription?.unsubscribe();
    this.updatePostSubscription?.unsubscribe();
    this.autoSaveSubscription?.unsubscribe();

    combineLatest([this.createPostError$, this.fetchSinglePostError$, this.updatePostError$])
      .pipe(
        take(1),
        tap(([createError, fetchError, updateError]) => {
          if (createError || fetchError || updateError) {
            this.store$.dispatch(PostStoreActions.purgePostStateErrors());
          }
        })
      ).subscribe();
  }

  get content() { return this.postForm.get(PostKeys.CONTENT) as FormControl<string>; }
  get description() { return this.postForm.get(PostKeys.DESCRIPTION) as FormControl<string>; }
  get keywords() { return this.postForm.get(PostKeys.KEYWORDS) as FormControl<string>; }
  get title() { return this.postForm.get(PostKeys.TITLE) as FormControl<string>; }
  get videoUrl() { return this.postForm.get(PostKeys.VIDEO_URL) as FormControl<string>; }
  get podcastEpisodeUrl() { return this.postForm.get(PostKeys.PODCAST_EPISODE_URL) as FormControl<string>; }

}
