import { Component, Input, OnInit, inject, input, signal } from '@angular/core';
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

  private configureSpotifyPlayer(episodeUrl: string) {

    const podcastEpisodeUrl = episodeUrl;
    const podcastEpisodeSlug = podcastEpisodeUrl.split('/').pop();
    console.log('Extracted this podcastEpisodeSlug', podcastEpisodeSlug);
    const baseEmbedUrl = `${PODCAST_PATHS.adve.embeddedPlayerUrl}`;

    const fullEmbedUrl = `${baseEmbedUrl}/${podcastEpisodeSlug}`;
    console.log('Generated this podcastEpisodeUrl', fullEmbedUrl);

    const embedHtml = `
      <iframe 
        class="spotify-iframe" 
        src="${fullEmbedUrl}"
        height="100%" 
        width="100%" 
        frameborder="0" 
        scrolling="no" 
      ></iframe>
    `;

    const safePodcastEpisodeLink = this.sanitizer.bypassSecurityTrustHtml(embedHtml);
    this.$podcastEpisodeHtml.set(safePodcastEpisodeLink);
    console.log('spotify data loaded', this.$podcastEpisodeHtml());

  }

}
