import { HeroImageProps } from './hero-image-props.model';

export class Post {
  title: string;
  author: string;
  authorId: string;
  content: string;
  published: Date;
  heroImageProps?: HeroImageProps;
  id?: string;
  imagesUpdated?: Date;
  imageSizes?: number[];
  imageFilePathList?: string[];
  videoUrl?: string;
}
