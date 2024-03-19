import { Timestamp } from '@angular/fire/firestore';
import { ImageProps } from '../images/image-props.model';
import { BlogDomains } from './blog-domains.model';
import { GoogleCloudFunctionsTimestamp } from '../firestore/google-cloud-functions-timestamp.model';

export enum PostKeys {
  AUTHOR_NAME ='authorName',
  AUTHOR_ID = 'authorId',
  BLOG_DOMAIN = 'blogDomain',
  CONTENT = 'content',
  CREATED_TIMESTAMP = 'createdTimestamp',
  DESCRIPTION = 'description',
  FEATURED = 'featured',
  HERO_IMAGES = 'heroImages',
  ID = 'id',
  IMAGES_LAST_UPDATED_TIMESTAMP = 'imagesLastUpdatedTimestamp',
  KEYWORDS = 'keywords',
  LAST_MODIFIED_TIMESTAMP = 'lastModifiedTimestamp',
  LAST_MODIFIED_USER_ID = 'lastModifiedUserId',
  LAST_MODIFIED_USER_NAME = 'lastModifiedUserName',
  PODCAST_EPISODE_URL = 'podcastEpisodeUrl',
  PODCAST_ANCHOR_RSS_FEED_URL = 'podcastRssFeedUrl', // Temporarily(?) different from new podcasters.spotify.com url, might eventually be updated to new spotify url
  PUBLISHED = 'published',
  PUBLISHED_TIMESTAMP = 'publishedTimestamp',
  READY_TO_PUBLISH = 'readyToPublish',
  SCHEDULED_AUTOPUBLISH_TIMESTAMP = 'scheduledAutopublishTimestamp',
  TITLE = 'title',
  VIDEO_URL = 'videoUrl',
}

export interface BlogIndexRef {
  [PostKeys.AUTHOR_ID]: string;
  [PostKeys.AUTHOR_NAME]: string;
  [PostKeys.CREATED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
  [PostKeys.FEATURED]: boolean;
  [PostKeys.ID]: string;
  [PostKeys.HERO_IMAGES]: PostHeroImageData;
  [PostKeys.LAST_MODIFIED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
  [PostKeys.LAST_MODIFIED_USER_ID]: string;
  [PostKeys.LAST_MODIFIED_USER_NAME]: string;
  [PostKeys.PUBLISHED]: boolean;
  [PostKeys.PUBLISHED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp | null;
  [PostKeys.READY_TO_PUBLISH]: boolean;
  [PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp | null;
  [PostKeys.TITLE]: string;
}

export interface Post extends BlogIndexRef {
  [PostKeys.BLOG_DOMAIN]: BlogDomains;
  [PostKeys.CONTENT]: string;
  [PostKeys.DESCRIPTION]: string;
  [PostKeys.IMAGES_LAST_UPDATED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp | null;
  [PostKeys.KEYWORDS]: string;
  [PostKeys.PODCAST_EPISODE_URL]: string | null;
  [PostKeys.VIDEO_URL]: string | null;
}

export interface PostHeroImageData {
  imageUrlLarge: string;
  imageUrlSmall: string;
}

export interface DefaultPostHeroImageSizeObject {
  smallImage: number,
  largeImage: number
}

export const PostFormVars = {
  descriptionMaxLength: 320,
  keywordsMaxLength: 500,
  titleMaxLength: 100, // This is the max length of a YouTube video
  titleMinLength: 5,
}

export const YOUTUBE_VIDEO_URL_VALIDATION_REGEX = /^((https:\/\/www\.youtube\.com)|(https:\/\/youtu\.be))/;

export const SPOTIFY_PODCAST_EPISODE_URL_VALIDATION_REGEX = /^\S*(?:https\:\/\/podcasters\.spotify\.com\/pod\/show\/)\S*$/




export interface OldBlogIndexRef {
  [PostKeys.TITLE]: string;
  published: boolean;
  publishedDate: number;
  imageProps: ImageProps;
  id: string;
  [PostKeys.FEATURED]: boolean;
}

export interface OldPost extends OldBlogIndexRef {
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

