import { PostImageType } from './post-image-type.model';

export interface PostImageMetadata {
  contentType: File['type'];
  customMetadata: {
    postId: string;
    postImageType: PostImageType;
    resizedImage?: boolean;
    imageSize?: number;
  };
}
