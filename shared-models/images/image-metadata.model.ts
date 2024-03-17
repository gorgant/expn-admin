import { UploadMetadata } from 'firebase/storage';
import { ImageType } from './image-type.model';

export interface PostImageMetadata extends UploadMetadata {
  contentType: File['type'];
  customMetadata: {
    fileExt: string;
    fileNameNoExt: string;
    filePath: string;
    imageType: ImageType;
    postId: string;
    resizedImage: string;
    storageBucket: string;
  };
}