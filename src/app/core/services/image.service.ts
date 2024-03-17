import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallableData } from '@angular/fire/functions';
import { UiService } from './ui.service';
import { Storage, StorageReference, UploadTask, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { PostImageMetadata } from '../../../../shared-models/images/image-metadata.model';
import { Observable, catchError, from, map, shareReplay, take, throwError } from 'rxjs';
import { AdminFunctionNames } from '../../../../shared-models/routes-and-paths/fb-function-names.model';
import { PostImageResizeData } from '../../../../shared-models/images/post-image-data.model';
import { PostHeroImageData } from '../../../../shared-models/posts/post.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private storage = inject(Storage);
  private functions = inject(Functions);
  private uiService = inject(UiService);

  constructor() { }

  private async fetchDownloadUrl(storageRef: StorageReference, task?: UploadTask): Promise<string> {
    if (task) {
      await task;
      console.log(`File uploaded to this path`, storageRef.fullPath);
    }
    const url = await getDownloadURL(storageRef);
    return url;
  }

  resizePostImage(imageMetaData: PostImageMetadata): Observable<PostHeroImageData> {
    console.log('Submitting request to server to resize postImage');

    const resizePostImageHttpCall: (data: PostImageMetadata) => Observable<PostHeroImageData> = httpsCallableData(
      this.functions,
      AdminFunctionNames.ON_CALL_RESIZE_POST_IMAGE
    );
    const res = resizePostImageHttpCall(imageMetaData)
      .pipe(
        take(1),
        map(postHeroImageData => {
          console.log('postImage resized, fetched this postHeroImageData:', postHeroImageData);
          if (!postHeroImageData) {
            throw new Error(`Error resizing postImage: ${postHeroImageData}`);
          }
          return postHeroImageData;
        }),
        catchError(error => {
          console.log('Error resizing postImage', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );

    return res;
  }

  uploadPostImageAndGetDownloadUrl(postImageData: PostImageResizeData): Observable<string> {

    const filePath = postImageData.imageMetadata.customMetadata.filePath;
    const storageBucket = postImageData.imageMetadata.customMetadata.storageBucket;
    const pathWithBucket = `${storageBucket}/${filePath}`;
    const storageRef = ref(this.storage, pathWithBucket);
    const task = uploadBytesResumable(storageRef, postImageData.file, postImageData.imageMetadata);

    return from(this.fetchDownloadUrl(storageRef, task))
      .pipe(
        map(downloadUrl => {
          console.log(`Fetched download url`, downloadUrl);
          return downloadUrl;
        }),
        shareReplay(),
        catchError(error => {
          console.log('Error fetching download url', error);
          this.uiService.showSnackBar('Hmm, something went wrong. Refresh the page and try again.', 10000);
          return throwError(() => new Error(error));
        })
      );
  }


}
