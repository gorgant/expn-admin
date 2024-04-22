import { Component, inject, input, signal } from '@angular/core';
import { AdminImagePaths } from '../../../../../../shared-models/routes-and-paths/image-paths.model';
import { GlobalFieldValues } from '../../../../../../shared-models/content/string-vals.model';
import { PostImageResizeData } from '../../../../../../shared-models/images/post-image-data.model';
import { Observable, Subscription, catchError, combineLatest, filter, map, switchMap, take, tap, throwError, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { UiService } from '../../../../core/services/ui.service';
import { HelperService } from '../../../../core/services/helpers.service';
import { PostStoreActions, PostStoreSelectors } from '../../../../root-store';
import { Post, PostHeroImageData, PostKeys } from '../../../../../../shared-models/posts/post.model';
import { PostImageMetadata } from '../../../../../../shared-models/images/image-metadata.model';
import { ImageType } from '../../../../../../shared-models/images/image-type.model';
import { AdminCsDirectoryPaths } from '../../../../../../shared-models/routes-and-paths/cs-directory-paths.model';
import { ProductionCloudStorage, SandboxCloudStorage } from '../../../../../../shared-models/environments/env-vars.model';
import { AsyncPipe } from '@angular/common';
import { ProcessingSpinnerComponent } from "../../../../shared/components/processing-spinner/processing-spinner.component";
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-image-uploader',
    standalone: true,
    templateUrl: './image-uploader.component.html',
    styleUrl: './image-uploader.component.scss',
    imports: [AsyncPipe, ProcessingSpinnerComponent, MatButtonModule]
})
export class ImageUploaderComponent {

  $post = input.required<Post>();

  DEFAULT_POST_IMAGE = AdminImagePaths.HERO_PLACEHOLDER;

  CANCEL_BUTTON_VALUE = GlobalFieldValues.CANCEL;
  UPLOAD_IMAGE_BUTTON_VALUE = GlobalFieldValues.UPLOAD_IMAGE;

  private $postImageResizeDataSubmitted = signal(false);
  private postImageResizeData!: PostImageResizeData;
  private postImageDownloadUrl$!: Observable<string | null>;
  private processPostImageSubscription!: Subscription;
  
  private uploadPostImageError$!: Observable<{} | null>;
  private uploadPostImageProcessing$!: Observable<boolean>;

  $postHeroImageData = signal(undefined as PostHeroImageData | undefined);
  
  $resizePostImageCycleInit = signal(false);
  private $resizePostImageCycleComplete = signal(false);
  private $resizePostImageSubmitted = signal(false);
  private resizePostImageError$!: Observable<{} | null>;
  private resizePostImageProcessing$!: Observable<boolean>;
  private resizePostImageSucceeded$!: Observable<PostHeroImageData | null>;

  combinedUploadPostImageError$!: Observable<{} | null>;
  combinedUploadPostImageProcessing$!: Observable<boolean>;

  private store$ = inject(Store);
  private uiService = inject(UiService);
  private helperService = inject(HelperService);

  constructor() { }

  ngOnInit(): void {
    this.monitorUpdateRequests();
  }

  private monitorUpdateRequests(): void {

    this.uploadPostImageError$ = this.store$.select(PostStoreSelectors.selectUploadPostImageError);
    this.uploadPostImageProcessing$ = this.store$.select(PostStoreSelectors.selectUploadPostImageProcessing);

    this.postImageDownloadUrl$ = this.store$.select(PostStoreSelectors.selectPostImageDownloadUrl);

    this.resizePostImageError$ = this.store$.select(PostStoreSelectors.selectResizePostImageError);
    this.resizePostImageProcessing$ = this.store$.select(PostStoreSelectors.selectResizePostImageProcessing);

    this.resizePostImageSucceeded$ = this.store$.select(PostStoreSelectors.selectResizePostImageSucceeded);

    this.combinedUploadPostImageProcessing$ = combineLatest(
      [
        this.uploadPostImageProcessing$,
        this.resizePostImageProcessing$,
      ]
    ).pipe(
        map(([uploadingPost, resizingPost]) => {
          if (uploadingPost || resizingPost) {
            return true
          }
          return false
        })
    );

    this.combinedUploadPostImageError$ = combineLatest(
      [
        this.uploadPostImageError$,
        this.resizePostImageError$,
      ]
    ).pipe(
        map(([uploadError, resizeError]) => {
          if (uploadError || resizeError) {
            return uploadError || resizeError;
          }
          return false
        })
    );
  }
  
  onSubmit(event: Event) {
    const fileList: FileList | null = (event.target as HTMLInputElement).files;
    const imageFile: File | null = fileList ? fileList[0] : null;
    const isValidImage = this.isValidImage(imageFile);
    if (!imageFile || !isValidImage) {
      return;
    }
    this.processPostImage(imageFile);
  }

  private processPostImage(imageFile: File) {
    let originalImageUrl: string;
    // 1) Upload image to cloud storage 2) resize image in cloud function (which also updates the post) 3) retreive image urls
    this.processPostImageSubscription = this.combinedUploadPostImageError$
      .pipe(
        map(processingError => {
          if (processingError) {
            console.log('processingError detected, terminating pipe', processingError);
            this.resetComponentState();
          }
          return processingError;
        }),
        filter(processingError => !processingError ), // Halts function if processingError detected
        switchMap(processingError => {
          console.log('processPostImage triggered');
          if (!this.$postImageResizeDataSubmitted()) {
            originalImageUrl = this.$post()[PostKeys.HERO_IMAGES]?.imageUrlLarge || 'none';
            this.$postImageResizeDataSubmitted.set(true);
            const postImageResizeData = this.generatePostImageResizeData(imageFile);
            if (!postImageResizeData) {
              throw new Error('Error generating postImageResizeData!');
            }
            this.postImageResizeData = postImageResizeData;
            this.store$.dispatch(PostStoreActions.uploadPostImageRequested({postImageResizeData}));
          }
          return this.postImageDownloadUrl$
        }),
        filter(downloadUrl => !!downloadUrl),
        switchMap(downloadUrl => {
          console.log('post upload successful, proceeding with pipe');
          if (!this.$resizePostImageSubmitted()) {
            this.$resizePostImageSubmitted.set(true);
            this.$resizePostImageCycleInit.set(true);
            const postImageMetadata = this.postImageResizeData.imageMetadata;
            // Note, this cloud function also updates the user
            this.store$.dispatch(PostStoreActions.resizePostImageRequested({postImageMetadata}));
          }
          return this.resizePostImageSucceeded$;
        }),
        filter(postHeroImageData => !!postHeroImageData),
        tap(postHeroImageData => {
          console.log('Post resize succeeded, loaded this data in component', postHeroImageData);
          this.resetComponentState();
        }),
        // Catch any local errors
        catchError(error => {
          console.log('Error in component:', error);
          this.uiService.showSnackBar(`Something went wrong. Please try again.`, 7000);
          this.resetComponentState();
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }

  private resetComponentState() {
    this.processPostImageSubscription?.unsubscribe();

    this.$postImageResizeDataSubmitted.set(false);
    this.$resizePostImageSubmitted.set(false);
    this.$resizePostImageCycleInit.set(false);
    this.$resizePostImageCycleComplete.set(false);
    
    this.store$.dispatch(PostStoreActions.purgePostImageData());
    this.store$.dispatch(PostStoreActions.purgePostStateErrors());
  }

  private isValidImage(file: File | null): boolean {
    if (!file) {
      return false;
    }
    // Confirm valid file type
    if (file?.type.split('/')[0] !== 'image') {
      this.uiService.showSnackBar('Invalid file type. Please try again.', 7000);
      return false;
    }

    if (file?.size > (10 * 1000000)) {
      this.uiService.showSnackBar('Image is too large. Please choose an image that is less than 10MB.', 7000);
      return false;
    }
    return true;
  }

  private generatePostImageResizeData(file: File): PostImageResizeData | undefined {
    const fileNameNoExt: string = `${ImageType.POST_HERO}-${this.$post()[PostKeys.ID] as string}`;
    const fileExtension = this.helperService.sanitizeFileName(file).fileExt;
    const imageMetadata: PostImageMetadata = {
      contentType: file.type,
      customMetadata: {
        fileExt: fileExtension,
        fileNameNoExt,
        filePath: this.generatePostImagePath(file, fileNameNoExt, fileExtension),
        imageType: ImageType.POST_HERO,
        postId: this.$post()[PostKeys.ID] as string,
        resizedImage: 'false',
        storageBucket: this.getBlogStorageBucketBasedOnEnvironment()
      }
    };

    const postImageResizeData: PostImageResizeData = {
      file,
      imageMetadata
    };

    return postImageResizeData;
  }

  private generatePostImagePath(file: File, fileNameNoExt: string, fileExtension: string): string {
    const postId = this.$post()[PostKeys.ID] as string;
    const folder = `${AdminCsDirectoryPaths.POST_IMAGES}/${postId}`;
    const name = `${fileNameNoExt}.${fileExtension}`;
    const filePath = `${folder}/${name}`;
    return filePath;
  }

  private getBlogStorageBucketBasedOnEnvironment(): string {
    const storageBucket = this.helperService.isProductionEnvironment() ? ProductionCloudStorage.EXPN_ADMIN_BLOG_STORAGE_GS_PREFIX : SandboxCloudStorage.EXPN_ADMIN_BLOG_STORAGE_GS_PREFIX;
    return storageBucket;
  }

  ngOnDestroy(): void {
    this.processPostImageSubscription?.unsubscribe();

    this.combinedUploadPostImageError$
      .pipe(
        take(1),
        map(error => {
          if (error) {
            this.store$.dispatch(PostStoreActions.purgePostStateErrors());
          }
        })
      )
  }


}
