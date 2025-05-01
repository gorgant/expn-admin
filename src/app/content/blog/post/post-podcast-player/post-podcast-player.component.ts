import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Post, PostKeys } from '../../../../../../shared-models/posts/post.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PODCAST_PATHS } from '../../../../../../shared-models/podcast/podcast-vars.model';
import { ProcessingSpinnerComponent } from "../../../../shared/components/processing-spinner/processing-spinner.component";

@Component({
    selector: 'app-post-podcast-player',
    standalone: true,
    templateUrl: './post-podcast-player.component.html',
    styleUrl: './post-podcast-player.component.scss',
    imports: [ProcessingSpinnerComponent]
})
export class PostPodcastPlayerComponent implements OnInit {

  $post = input.required<Post>();

  $podcastEpisodeHtml = signal(undefined as SafeHtml | undefined);

  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    if (this.$post()[PostKeys.PODCAST_EPISODE_URL]) {
      this.configureSpotifyPlayer(this.$post()[PostKeys.PODCAST_EPISODE_URL]!);
    }
  }

  private extractSpotifyEpisodeId(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const pathnameParts = parsedUrl.pathname.split('/');
      if (pathnameParts[1] === 'episode' && pathnameParts[2]) {
        return pathnameParts[2];
      }
    } catch (e) {
      console.error('Invalid URL:', e);
    }
    return null;
  }

  private configureSpotifyPlayer(episodeUrl: string) {

    const podcastEpisodeId = this.extractSpotifyEpisodeId(episodeUrl);
    if (podcastEpisodeId === null) {
      console.error('Invalid Spotify episode URL. Aborting iframe construction.', episodeUrl);
      return;
    }
    console.log('Extracted this podcastEpisodeId', podcastEpisodeId);
    const baseEmbedUrl = `${PODCAST_PATHS.expn.embeddedPlayerUrl}`;
    const fullEmbedUrl = `${baseEmbedUrl}/${podcastEpisodeId}`;
    console.log('Generated this podcastEpisodeUrl', fullEmbedUrl);

    const embedHtml = `
      <iframe 
        style="border-radius:12px" 
        src="${fullEmbedUrl}" 
        width="100%" 
        height="200" 
        frameBorder="0" 
        allowfullscreen="" 
        allow="autoplay; 
        clipboard-write; 
        encrypted-media; 
        loading="lazy"
      ></iframe>
    `;

    const safePodcastEpisodeLink = this.sanitizer.bypassSecurityTrustHtml(embedHtml);
    this.$podcastEpisodeHtml.set(safePodcastEpisodeLink);
    console.log('spotify data loaded', this.$podcastEpisodeHtml());

  }

}
