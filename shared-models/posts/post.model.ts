import { ImageProps } from '../images/image-props.model';
import { BlogDomains } from './blog-domains.model';

export enum PostKeys {
  BLOG_DOMAIN = 'blogDomain',
  CONTENT = 'content',
  DESCRIPTION = 'description',
  FEATURED = 'featured',
  KEYWORDS = 'keywords',
  PODCAST_EPISODE_URL = 'podcastEpisodeUrl',
  PODCAST_ANCHOR_RSS_FEED_URL = 'podcastRssFeedUrl', // Temporarily(?) different from new podcasters.spotify.com url, might eventually be updated to new spotify url
  PUBLISHED_DATE = 'publishedDate',
  TITLE = 'title',
  VIDEO_URL = 'videoUrl',
}

export interface BlogIndexPostRef {
  [PostKeys.TITLE]: string;
  published: boolean;
  publishedDate: number;
  imageProps: ImageProps;
  id: string;
  [PostKeys.FEATURED]: boolean;
}

export interface Post extends BlogIndexPostRef {
  author: string;
  authorId: string;
  [PostKeys.CONTENT]: string;
  [PostKeys.DESCRIPTION]: string;
  [PostKeys.KEYWORDS]: string;
  modifiedDate: number;
  [PostKeys.BLOG_DOMAIN]: BlogDomains;
  imagesUpdated?: number;
  imageSizes?: number[];
  imageFilePathList?: string[];
  [PostKeys.VIDEO_URL]?: string;
  readyToPublish?: boolean;
  [PostKeys.PODCAST_EPISODE_URL]?: string;
  [PostKeys.PODCAST_ANCHOR_RSS_FEED_URL]?: string;
  scheduledPublishTime?: number | null;
}
