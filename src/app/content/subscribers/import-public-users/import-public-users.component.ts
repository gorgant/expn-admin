import { Component, inject, signal } from '@angular/core';
import { GlobalFieldValues } from '../../../../../shared-models/content/string-vals.model';
import { PublicUserImportData, PublicUserImportMetadata, PublicUserImportVars } from '../../../../../shared-models/user/public-user-import-data.model';
import { Observable, Subscription, catchError, combineLatest, filter, map, switchMap, take, tap, throwError, withLatestFrom } from 'rxjs';
import { DateTime } from 'luxon';
import { ProductionCloudStorage, SandboxCloudStorage } from '../../../../../shared-models/environments/env-vars.model';
import { AdminCsDirectoryPaths } from '../../../../../shared-models/routes-and-paths/cs-directory-paths.model';
import { UserStoreActions, UserStoreSelectors } from '../../../root-store';
import { Store } from '@ngrx/store';
import { UiService } from '../../../core/services/ui.service';
import { HelperService } from '../../../core/services/helpers.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ProcessingSpinnerComponent } from '../../../shared/components/processing-spinner/processing-spinner.component';

@Component({
  selector: 'app-import-public-users',
  standalone: true,
  imports: [AsyncPipe, ProcessingSpinnerComponent, MatButtonModule],
  templateUrl: './import-public-users.component.html',
  styleUrl: './import-public-users.component.scss'
})
export class ImportPublicUsersComponent {

  IMPORT_PUBLIC_USERS_BUTTON_VALUE = GlobalFieldValues.IMPORT_PUBLIC_USERS;

  private $uploadPublicUserImportDataSubmitted = signal(false);
  private publicUserImportData!: PublicUserImportData;
  private publicUserImportDataDownloadUrl$!: Observable<string | null>;
  private processPublicUserImportDataSubscription!: Subscription;
  
  private uploadPublicUserImportDataError$!: Observable<{} | null>;
  private uploadPublicUserImportDataProcessing$!: Observable<boolean>;

  $processPublicUserImportDataCycleInit = signal(false);
  private $processPublicUserImportDataCycleComplete = signal(false);
  private $processPublicUserImportDataSubmitted = signal(false);
  private processPublicUserImportDataError$!: Observable<{} | null>;
  private processPublicUserImportDataProcessing$!: Observable<boolean>;

  combinedHandlePublicUserImportDataError$!: Observable<{} | null>;
  combinedHandlePublicUserImportDataProcessing$!: Observable<boolean>;

  private store$ = inject(Store);
  private uiService = inject(UiService);
  private helperService = inject(HelperService);

  constructor() { }

  ngOnInit(): void {
    this.monitorUpdateRequests();
  }

  private monitorUpdateRequests(): void {

    this.uploadPublicUserImportDataError$ = this.store$.select(UserStoreSelectors.selectUploadPublicUserImportDataError);
    this.uploadPublicUserImportDataProcessing$ = this.store$.select(UserStoreSelectors.selectUploadPublicUserImportDataProcessing);

    this.publicUserImportDataDownloadUrl$ = this.store$.select(UserStoreSelectors.selectPublicUserImportDataDownloadUrl);

    this.processPublicUserImportDataError$ = this.store$.select(UserStoreSelectors.selectProcessPublicUserImportDataError);
    this.processPublicUserImportDataProcessing$ = this.store$.select(UserStoreSelectors.selectProcessPublicUserImportDataProcessing);

    this.combinedHandlePublicUserImportDataProcessing$ = combineLatest(
      [
        this.uploadPublicUserImportDataProcessing$,
        this.processPublicUserImportDataProcessing$,
      ]
    ).pipe(
        map(([uploadingPost, resizingPost]) => {
          if (uploadingPost || resizingPost) {
            return true
          }
          return false
        })
    );

    this.combinedHandlePublicUserImportDataError$ = combineLatest(
      [
        this.uploadPublicUserImportDataError$,
        this.processPublicUserImportDataError$,
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
    const dataFile: File | null = fileList ? fileList[0] : null;
    const isValidFile = this.isValidCsvFile(dataFile);
    if (!dataFile || !isValidFile) {
      return;
    }
    this.processPublicUserImportData(dataFile);
  }

  private processPublicUserImportData(imageFile: File) {
    // 1) Upload data to cloud storage 2) process CSV in cloud function
    this.processPublicUserImportDataSubscription = this.combinedHandlePublicUserImportDataError$
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
          console.log('processPublicUserImportData triggered');
          if (!this.$uploadPublicUserImportDataSubmitted()) {
            this.$uploadPublicUserImportDataSubmitted.set(true);
            const publicUserImportData = this.generatePublicUserImportData(imageFile);
            if (!publicUserImportData) {
              throw new Error('Error generating publicUserImportData!');
            }
            this.publicUserImportData = publicUserImportData;
            this.store$.dispatch(UserStoreActions.uploadPublicUserImportDataRequested({publicUserImportData}));
          }
          return this.publicUserImportDataDownloadUrl$
        }),
        filter(downloadUrl => !!downloadUrl),
        switchMap(downloadUrl => {
          console.log('uploadPublicUserImportData successful, proceeding with pipe');
          if (!this.$processPublicUserImportDataSubmitted()) {
            this.$processPublicUserImportDataSubmitted.set(true);
            const importMetadata = this.publicUserImportData.importMetadata;
            // Note, this cloud function also updates the user
            this.store$.dispatch(UserStoreActions.processPublicUserImportDataRequested({publicUserImportMetadata: importMetadata}));
          }
          return this.processPublicUserImportDataProcessing$;
        }),
        // This tap/filter pattern ensures an async action has completed before proceeding with the pipe
        tap(requestProcessing => {
          if (requestProcessing) {
            this.$processPublicUserImportDataCycleInit.set(true);
          }
          if (!requestProcessing && this.$processPublicUserImportDataCycleInit()) {
            console.log('processPublicUserImportData successful, proceeding with pipe.');
            this.$processPublicUserImportDataCycleInit.set(false);
            this.$processPublicUserImportDataCycleComplete.set(true);
          }
        }),
        filter(requestProcessing => !requestProcessing && this.$processPublicUserImportDataCycleComplete()),
        tap(requestProcessing => {
          console.log('processPublicUserImportData succeeded', this.publicUserImportData.importMetadata);
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
    this.processPublicUserImportDataSubscription?.unsubscribe();

    this.$uploadPublicUserImportDataSubmitted.set(false);
    this.$processPublicUserImportDataSubmitted.set(false);
    this.$processPublicUserImportDataCycleInit.set(false);
    this.$processPublicUserImportDataCycleComplete.set(false);
    
    this.store$.dispatch(UserStoreActions.purgeImportDownloadUrl());
    this.store$.dispatch(UserStoreActions.purgeUserStateErrors());
  }

  private isValidCsvFile(file: File | null): boolean {
    if (!file) {
      return false;
    }

    // Check the MIME type and file extension for Excel files
    // Courtesy of: https://chat.openai.com/share/e/d8ac2526-7a82-404b-9c1b-303ae2b4b6f1
    const validMimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isValidFileType = validMimeTypes.includes(file.type) || fileExtension === 'xlsx';

    if (!isValidFileType) {
      this.uiService.showSnackBar('Invalid file type. Must be a .xlsx file. Please try again.', 7000);
      return false;
    }

    if (file?.size > (10 * 1000000)) {
      this.uiService.showSnackBar('File is too large. Please choose an image that is less than 10MB.', 7000);
      return false;
    }
    return true;
  }

  private generatePublicUserImportData(file: File): PublicUserImportData | undefined {
    const fileNameNoExt: string = `${PublicUserImportVars.FILE_NAME_PREFIX}-${DateTime.now().toMillis()}`;
    const fileExtension = this.helperService.sanitizeFileName(file).fileExt;
    const importMetadata: PublicUserImportMetadata = {
      contentType: file.type,
      customMetadata: {
        fileExt: fileExtension,
        fileNameNoExt,
        filePath: this.generatePublicUserImportDataPath(file, fileNameNoExt, fileExtension),
        storageBucket: this.getPublicUserImportsBucketBasedOnEnvironment()
      }
    };

    const publicUserImportData: PublicUserImportData = {
      file,
      importMetadata
    };

    return publicUserImportData;
  }

  private generatePublicUserImportDataPath(file: File, fileNameNoExt: string, fileExtension: string): string {
    const folder = `${AdminCsDirectoryPaths.PUBLIC_USER_IMPORTS}`;
    const name = `${fileNameNoExt}.${fileExtension}`;
    const filePath = `${folder}/${name}`;
    return filePath;
  }

  private getPublicUserImportsBucketBasedOnEnvironment(): string {
    const storageBucket = this.helperService.isProductionEnvironment() ? ProductionCloudStorage.EXPN_ADMIN_DATA_IMPORTS_STORAGE_GS_PREFIX : SandboxCloudStorage.EXPN_ADMIN_DATA_IMPORTS_STORAGE_GS_PREFIX;
    return storageBucket;
  }

  ngOnDestroy(): void {
    this.processPublicUserImportDataSubscription?.unsubscribe();

    this.combinedHandlePublicUserImportDataError$
      .pipe(
        take(1),
        withLatestFrom(this.publicUserImportDataDownloadUrl$),
        map(([error, downloadUrl]) => {
          if (error) {
            this.store$.dispatch(UserStoreActions.purgeUserStateErrors());
          }
          if (downloadUrl) {
            this.store$.dispatch(UserStoreActions.purgeImportDownloadUrl());
          }
        })
      )
    
  }


}
