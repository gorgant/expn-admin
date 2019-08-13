import { ImageProps } from '../images/image-props.model';
import { BlogDomains } from './blog-domains.model';

export interface Post {
  title: string;
  author: string;
  authorId: string;
  content: string;
  description: string;
  keywords: string;
  modifiedDate: number;
  blogDomain: BlogDomains;
  published?: boolean;
  publishedDate?: number;
  imageProps?: ImageProps;
  id?: string;
  imagesUpdated?: Date;
  imageSizes?: number[];
  imageFilePathList?: string[];
  videoUrl?: string;
  featured?: boolean;
  readyToPublish?: boolean;
  podcastEpisodeUrl?: string;
}

