import { Timestamp } from "@angular/fire/firestore";
import { GoogleCloudFunctionsTimestamp } from "../firestore/google-cloud-functions-timestamp.model";

export enum PodcastEpisodeKeys {
  AUTHOR = 'author',
  BLOG_POST_ID = 'blogPostId',
  BLOG_POST_URL_HANDLE = 'blogPostUrlHandle',
  DESCRIPTION = 'description',
  DURATION = 'duration',
  EPISODE_URL = 'episodeUrl',
  GUID = 'guid',
  ID = 'id',
  IMAGE_URL = 'imageUrl',
  LAST_MODIFIED_TIMESTAMP = 'lastModifiedTimestamp',
  PUBLISHED_TIMESTAMP = 'publishedTimestamp',
  TITLE = 'title'
}
export interface PodcastEpisode {
  [PodcastEpisodeKeys.AUTHOR]: string;
  [PodcastEpisodeKeys.BLOG_POST_ID]: string;
  [PodcastEpisodeKeys.BLOG_POST_URL_HANDLE]: string;
  [PodcastEpisodeKeys.DESCRIPTION]: string;
  [PodcastEpisodeKeys.DURATION]: number;
  [PodcastEpisodeKeys.EPISODE_URL]: string;
  [PodcastEpisodeKeys.GUID]: string;
  [PodcastEpisodeKeys.ID]: string;
  [PodcastEpisodeKeys.IMAGE_URL]: string;
  [PodcastEpisodeKeys.LAST_MODIFIED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
  [PodcastEpisodeKeys.PUBLISHED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
  [PodcastEpisodeKeys.TITLE]: string;
}
