import { Component, Input, OnInit, Renderer2, ViewChild, computed, inject, input, signal, viewChild } from '@angular/core';
import { Post, PostKeys } from '../../../../../../shared-models/posts/post.model';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';
import { UiService } from '../../../../core/services/ui.service';
import { HelperService } from '../../../../core/services/helpers.service';
import { ProcessingSpinnerComponent } from "../../../../shared/components/processing-spinner/processing-spinner.component";
import { DOCUMENT, NgStyle } from '@angular/common';
import { YouTubeChannelIds } from '../../../../../../shared-models/meta/social-urls.model';

@Component({
    selector: 'app-post-video-player',
    standalone: true,
    templateUrl: './post-video-player.component.html',
    styleUrl: './post-video-player.component.scss',
    imports: [YouTubePlayerModule, ProcessingSpinnerComponent, NgStyle]
})
export class PostVideoPlayerComponent implements OnInit {

  $post = input.required<Post>();

  YOUTUBE_CHANNEL_ID = YouTubeChannelIds.EXPN;

  $youtubeVideoId = signal(undefined as string | undefined);
  private $ytVideoPlayerApi = viewChild<YouTubePlayer>('ytVideoPlayerApi');
  $videoPlayerWidth = signal(undefined as number | undefined);
  $videoPlayerHeight = signal(undefined as number | undefined);
  $videoPlayerOptions = signal({});
  $subscribeButtonContainerWidth = signal(undefined as string | undefined);


  uiService = inject(UiService);
  private helperService = inject(HelperService);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  $screenIsMobile = computed(() => {
    return this.uiService.$screenIsMobile();
  });

  constructor() { }

  ngOnInit(): void {
    if (this.$post()[PostKeys.VIDEO_URL]) {
      this.setYoutubeVideoId(this.$post()[PostKeys.VIDEO_URL]!);
    }
    if (!this.uiService.$isServerPlatform()) {
      this.initializeYoutubePlayer();
    }
  }

  private setYoutubeVideoId(videoUrl: string) {
    const videoId = this.helperService.extractYoutubeVideoIdFromUrl(videoUrl);
    this.$youtubeVideoId.set(videoId);
  }

  private initializeYoutubePlayer() {
    this.configurePlayerDimensions();
    this.configurePlayerOptions();
    this.initSubscribeButton();
  }

  private configurePlayerDimensions() {
    let screenWidth = this.uiService.screenWidth;
    if (!screenWidth) {
      console.log('Screenwidth not available, will not configure player dimensions');
      return;
    }
    console.log('Configuring player with this screen width', screenWidth);
    if (screenWidth > 800) {
      screenWidth = 1000;
    }
    let screenHeight = Math.round((screenWidth*360)/640);
    this.$videoPlayerWidth.set(screenWidth);
    this.$subscribeButtonContainerWidth.set(`${screenWidth}px`);
    this.$videoPlayerHeight.set(screenHeight);
  }

  private configurePlayerOptions() {
    this.$videoPlayerOptions.set({
      controls: 1, 
      modestbranding: 1, 
      rel: 0
    });
  }

  // https://developers.google.com/youtube/subscribe/
  private initSubscribeButton() {
    const script = this.renderer.createElement('script');
    this.renderer.setProperty(script, 'type', 'text/javascript');
    this.renderer.setProperty(script, 'src', 'https://apis.google.com/js/platform.js');
    this.renderer.setProperty(script, 'async', 'true');
    this.renderer.setProperty(script, 'charset', 'utf-8');
    this.renderer.appendChild(this.document.body, script);
    console.log('subscribe script appended');
  }

}
