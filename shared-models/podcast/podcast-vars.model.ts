export enum PodcastVars {
  PODCAST_QUERY_LIMIT = '40',
  PODCAST_ID_SPLIT_CODE = 'anchor.fm/s/'
}

enum PodcastIds {
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
    landingPageUrl: `https://anchor.fm/${PodcastIds.EXPN_USER_ID}`,
    embeddedPlayerUrl: `https://podcasters.spotify.com/pod/show/${PodcastIds.EXPN_USER_ID}/embed/episodes`,
    anchorRssFeedEpisodeUrl: `https://anchor.fm/${PodcastIds.EXPN_USER_ID}/episodes` // Temporarily(?) different from new podcasters.spotify.com url, might eventually be updated to new spotify url
  },
  mdls: {
    rssFeedPath: `https://anchor.fm/s/${PodcastIds.MDLS_RSS_FEED_ID}/podcast/rss`,
    landingPageUrl: `https://anchor.fm/${PodcastIds.MDLS_USER_ID}`,
    embeddedPlayerUrl: `https://podcasters.spotify.com/pod/show/${PodcastIds.MDLS_USER_ID}/embed/episodes`,
    anchorRssFeedEpisodeUrl: `https://anchor.fm/${PodcastIds.MDLS_USER_ID}/episodes` // Temporarily(?) different from new podcasters.spotify.com url, might eventually be updated to new spotify url
  },
  syw: {
    rssFeedPath: `https://anchor.fm/s/${PodcastIds.SYW_RSS_FEED_ID}/podcast/rss`,
    landingPageUrl: `https://anchor.fm/${PodcastIds.SYW_USER_ID}`,
    embeddedPlayerUrl: `https://podcasters.spotify.com/pod/show/${PodcastIds.SYW_USER_ID}/embed/episodes`,
    anchorRssFeedEpisodeUrl: `https://anchor.fm/${PodcastIds.SYW_USER_ID}/episodes` // Temporarily(?) different from new podcasters.spotify.com url, might eventually be updated to new spotify url
  },
  adve: {
    rssFeedPath: `https://anchor.fm/s/${PodcastIds.ADVE_RSS_FEED_ID}/podcast/rss`,
    landingPageUrl: `https://anchor.fm/${PodcastIds.ADVE_USER_ID}`,
    embeddedPlayerUrl: `https://podcasters.spotify.com/pod/show/${PodcastIds.ADVE_USER_ID}/embed/episodes`,
    anchorRssFeedEpisodeUrl: `https://anchor.fm/${PodcastIds.ADVE_USER_ID}/episodes` // Temporarily(?) different from new podcasters.spotify.com url, might eventually be updated to new spotify url
  }
};
