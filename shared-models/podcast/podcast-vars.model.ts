import { SocialUrlPrefixes } from "../meta/social-urls.model";

export enum PodcastVars {
  PODCAST_QUERY_LIMIT = '40',
  PODCAST_ID_SPLIT_CODE = 'anchor.fm/s/'
}

export enum PodcastIds {
  EXPN_RSS_FEED_ID = '6d8b762c',
  EXPN_USER_ID = 'explearning',
  MDLS_RSS_FEED_ID = 'TBD',
  MDLS_USER_ID = 'TBD',
  SYW_RSS_FEED_ID = '712c5850',
  SYW_USER_ID = 'stakeyourwealth',
  ADVE_RSS_FEED_ID = '6d05bdc0',
  ADVE_USER_ID = 'advanced_english',
}

export const PODCAST_PATHS = {
  expn: {
    rssFeedPath: `https://anchor.fm/s/${PodcastIds.EXPN_RSS_FEED_ID}/podcast/rss`,
    embeddedPlayerUrl: `${SocialUrlPrefixes.SPOTIFY_PODCAST}/${PodcastIds.EXPN_USER_ID}/embed/episodes`,
    publicLandingPage: `${SocialUrlPrefixes.SPOTIFY_PODCAST}/${PodcastIds.EXPN_USER_ID}`,
  },
  mdls: {
    rssFeedPath: `https://anchor.fm/s/${PodcastIds.MDLS_RSS_FEED_ID}/podcast/rss`,
    embeddedPlayerUrl: `${SocialUrlPrefixes.SPOTIFY_PODCAST}/${PodcastIds.MDLS_USER_ID}/embed/episodes`,
    publicLandingPage: `${SocialUrlPrefixes.SPOTIFY_PODCAST}/${PodcastIds.MDLS_USER_ID}`,
  },
  syw: {
    rssFeedPath: `https://anchor.fm/s/${PodcastIds.SYW_RSS_FEED_ID}/podcast/rss`,
    embeddedPlayerUrl: `${SocialUrlPrefixes.SPOTIFY_PODCAST}/${PodcastIds.SYW_USER_ID}/embed/episodes`,
    publicLandingPage: `${SocialUrlPrefixes.SPOTIFY_PODCAST}/${PodcastIds.SYW_USER_ID}`,
  },
  adve: {
    rssFeedPath: `https://anchor.fm/s/${PodcastIds.ADVE_RSS_FEED_ID}/podcast/rss`,
    embeddedPlayerUrl: `${SocialUrlPrefixes.SPOTIFY_PODCAST}/${PodcastIds.ADVE_USER_ID}/embed/episodes`,
    publicLandingPage: `${SocialUrlPrefixes.SPOTIFY_PODCAST}/${PodcastIds.ADVE_USER_ID}`,
  }
};
