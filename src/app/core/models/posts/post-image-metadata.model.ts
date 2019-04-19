import { ImageType } from '../images/image-type.model';

export interface PostImageMetadata {
  contentType: File['type'];
  customMetadata: {
    postId: string;
    postImageType: ImageType;
    resizedImage?: boolean;
    imageSize?: number;
  };
}
