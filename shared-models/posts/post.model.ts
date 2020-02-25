import { ImageProps } from '../images/image-props.model';
import { BlogDomains } from './blog-domains.model';
import { BlogIndexPostRef } from './blog-index-post-ref.model';

export interface Post extends BlogIndexPostRef {
  title: string;
  author: string;
  authorId: string;
  content: string;
  description: string;
  keywords: string;
  modifiedDate: number;
  blogDomain: BlogDomains;
  published: boolean;
  publishedDate: number;
  imageProps: ImageProps;
  id: string;
  featured: boolean;
  imagesUpdated?: number;
  imageSizes?: number[];
  imageFilePathList?: string[];
  videoUrl?: string;
  readyToPublish?: boolean;
  podcastEpisodeUrl?: string;
  scheduledPublishTime?: number | null;
}
