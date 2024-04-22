import { UploadMetadata } from "@angular/fire/storage";

export interface PublicUserImportMetadata extends UploadMetadata {
  contentType: File['type'];
  customMetadata: {
    fileExt: string;
    fileNameNoExt: string;
    filePath: string;
    storageBucket: string;
  };
}

export interface PublicUserImportData {
  file: File,
  importMetadata: PublicUserImportMetadata
};

export enum PublicUserImportVars {
  FILE_NAME_PREFIX = 'public-user-import'
}