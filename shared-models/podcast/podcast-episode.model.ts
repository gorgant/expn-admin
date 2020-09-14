
export enum PodcastEpisodeKeys {
  PUB_DATE = 'pubDate'
}
export interface PodcastEpisode {
  id: string;
  guid: string;
  title: string;
  [PodcastEpisodeKeys.PUB_DATE]: number;
  episodeUrl: string;
  duration: number;
  author: string;
  description: string;
  imageUrl: string;
  modifiedDate: number;
  blogPostId: string;
  blogPostUrlHandle: string;
}
