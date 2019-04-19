import { ImageProps } from '../images/image-props.model';

export class Post {
  title: string;
  author: string;
  authorId: string;
  content: string;
  modifiedDate: number;
  published?: boolean;
  publishedDate?: number;
  heroImageProps?: ImageProps;
  id?: string;
  imagesUpdated?: Date;
  imageSizes?: number[];
  imageFilePathList?: string[];
  videoUrl?: string;
  featured?: boolean;
}
