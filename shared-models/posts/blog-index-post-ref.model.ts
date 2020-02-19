import { ImageProps } from '../images/image-props.model';

export interface BlogIndexPostRef {
  title: string;
  published: boolean;
  publishedDate: number;
  imageProps: ImageProps;
  id: string;
  featured: boolean;
}
