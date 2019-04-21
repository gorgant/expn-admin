import { ImageType } from './image-type.model';

export interface ImageMetadata {
  contentType: File['type'];
  customMetadata: {
    itemId: string;
    imageType: ImageType;
    resizedImage?: boolean;
    imageSize?: number;
    filePath?: string;
  };
}
