import { PostImageMetadata } from './post-image-metadata.model';

export interface PostImage {
  url: string;
  metadata: PostImageMetadata;
  id?: string;
}
