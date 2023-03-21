import { Component, OnInit, SecurityContext, OnDestroy, Renderer2, Inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, PostStoreSelectors, PostStoreActions, PodcastStoreSelectors, PodcastStoreActions } from 'src/app/root-store';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { withLatestFrom, map } from 'rxjs/operators';
import { Post } from 'shared-models/posts/post.model';
import { PageHeroData } from 'shared-models/forms-and-components/page-hero-data.model';
import { PublicAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { PRODUCTION_APPS, SANDBOX_APPS } from 'shared-models/environments/env-vars.model';
import { DOCUMENT } from '@angular/common';
import { UiService } from 'src/app/core/services/ui.service';
import { environment } from 'src/environments/environment';
import { PodcastEpisode } from 'shared-models/podcast/podcast-episode.model';
import { YouTubeChannelIds } from 'shared-models/routes-and-paths/social-urls.model';
import { PODCAST_PATHS } from 'shared-models/podcast/podcast-vars.model';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})
export class PostPreviewComponent implements OnInit, OnDestroy {

  postId: string;
  post$: Observable<Post>;
  error$: Observable<string>;
  errorSubscription: Subscription;
  isLoading$: Observable<boolean>;
  requestedPosts: boolean;
  titleSet: boolean;
  postSubscription: Subscription;

  episodeRequested: boolean;

  heroData: PageHeroData;

  sanitizedPostBody: SafeHtml;
  videoHtml: SafeHtml;
  podcastEpisodeHtml: SafeHtml;

  private productionEnvironment: boolean = environment.production;
  private origin: string;
  sanitizedSubscribeButtonContent: SafeHtml;
  youTubeChannelId = YouTubeChannelIds.EXPN;

  constructor(
    private store$: Store<RootStoreState.State>,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private uiService: UiService,
  ) { }

  ngOnInit() {
    this.loadExistingPostData();
    this.handlePostError();
  }

  private loadExistingPostData() {
    // Check if id params are available
    const idParamName = 'id';
    const idParam: string = this.route.snapshot.params[idParamName];
    if (idParam) {
      this.postId = idParam.toLowerCase(); // Remove any possible erroneous lowercasing (IDs are specifically set to lower case in admin)
      this.getPost();
      this.initializeHeroAndPostContent();
    }
  }

  // Triggered after params are fetched
  private getPost() {

    this.error$ = this.store$.select(PostStoreSelectors.selectLoadError);
    
    this.post$ = this.store$.select(PostStoreSelectors.selectPostById(this.postId))
    .pipe(
      withLatestFrom(this.store$.select(PostStoreSelectors.selectPostsLoaded)),
      map(([post, postsLoaded]) => {
        // Check if items are loaded, if not fetch from server
        if (!postsLoaded && !this.requestedPosts) {
          console.log('No post in store, fetching from server', this.postId);
          this.requestedPosts = true; // Prevents loading from firing more than needed
          this.store$.dispatch(new PostStoreActions.SinglePostRequested({postId: this.postId}));
        }
        this.requestedPosts = true; // Prevents loading from firing more than needed
        return post as Post;
      })
    );

    this.isLoading$ = this.store$.select(
      PostStoreSelectors.selectIsLoading
    );
  }

  // If post data available, patch values into form
  private initializeHeroAndPostContent() {

    this.postSubscription = this.post$
      .subscribe(post => {
        console.log('post subscription firing');
        if (post) {
          // console.log('Post retreived, doing nothing for debugging purposes');
          this.initializeHeroData(post);
          this.sanitizedPostBody = this.sanitizer.sanitize(SecurityContext.HTML, post.content);
          if (post.videoUrl) {
            this.configureVideoUrl(post.videoUrl);
            this.initSubscribeButton();
          }
          if (post.podcastEpisodeUrl) {
            console.log('Podcast url', post.podcastEpisodeUrl);
            this.configureAnchorPlayer(post.podcastEpisodeUrl);
          }
        }
      });
  }

  private setYouTubeIframeOriginBasedOnEnvironment(): string {
    switch (this.productionEnvironment) {
      case true:
        this.origin = `https://${PRODUCTION_APPS.expnPublicApp.websiteDomain}`;
        break;
      case false:
        this.origin = `https://${SANDBOX_APPS.expnPublicApp.websiteDomain}`;
        break;
      default:
        this.origin = `https://${SANDBOX_APPS.expnPublicApp.websiteDomain}`;
        break;
    }
    return this.origin;
  }

  private configureVideoUrl(videoUrl: string) {
    const videoId = videoUrl.split('/').pop();
    const baseEmbedUrl = `https://www.youtube.com/embed/${videoId}`;

    // See video parameters here: https://developers.google.com/youtube/player_parameters
    const videoParameters = {
      fs: 1,
      origin: `${this.setYouTubeIframeOriginBasedOnEnvironment()}`,
      rel: 0,
      enablejsapi: 1
    };

    // Courtesy of https://stackoverflow.com/a/12040639/6572208
    const urlParameters = Object.keys(videoParameters).map((key) => {
      return [key, videoParameters[key]].map(encodeURIComponent).join('=');
        }).join('&');

    const updatedUrl = `${baseEmbedUrl}?${urlParameters}`;

    const embedHtml = `
      <iframe
        src="${updatedUrl}"
        class="youtube-iframe"
        frameborder="0"
        allowfullscreen
        allow="
          accelerometer;
          encrypted-media;
          gyroscope;
          picture-in-picture"
      ></iframe>
    `;
    const safeVideoLink = this.sanitizer.bypassSecurityTrustHtml(embedHtml);
    this.videoHtml = safeVideoLink;
    console.log('video data loaded', this.videoHtml);
  }

  // https://developers.google.com/youtube/subscribe/
  private initSubscribeButton() {
    const script = this.renderer.createElement('script');
    // script.src = 'https://apis.google.com/js/platform.js';
    this.renderer.setProperty(script, 'type', 'text/javascript');
    this.renderer.setProperty(script, 'src', 'https://apis.google.com/js/platform.js');
    this.renderer.setProperty(script, 'async', 'true');
    this.renderer.setProperty(script, 'charset', 'utf-8');
    this.renderer.appendChild(this.document.body, script);
    console.log('subscribe script appended');
  }

  private configureAnchorPlayer(episodeUrl: string) {

    // Fetch episode data to load into player
    this.getPodcastEpisode(episodeUrl).subscribe(episode => {
      if (!episode) {
        console.log(`No podcast episode found matching the url: ${episodeUrl}`);
        return;
      }
      const podcastEpisodeUrl = episode.episodeUrl;
      const podcastEpisodeSlug = podcastEpisodeUrl.split('/').pop();
      const baseEmbedUrl = `${PODCAST_PATHS.expn.embeddedPlayerUrl}`;

      const fullEmbedUrl = `${baseEmbedUrl}/${podcastEpisodeSlug}`;

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
      this.podcastEpisodeHtml = safePodcastEpisodeLink;
      console.log('anchor data loaded', this.podcastEpisodeHtml);

    });

  }

  private getPodcastEpisode(podcastEpisodeUrl: string): Observable<PodcastEpisode> {
    const podcastId = this.uiService.getPodcastId(PODCAST_PATHS.expn.rssFeedPath);
    const episodeId = this.uiService.createOrReverseFirebaseSafeUrl(podcastEpisodeUrl.split('/').pop().toLowerCase()); // This matches the ID format as specified in the updatePodcastFeedCache function

    const podcastEpisode$ = this.store$.select(PodcastStoreSelectors.selectEpisodeById(episodeId))
      .pipe(
        withLatestFrom(this.store$.select(PodcastStoreSelectors.selectEpisodesLoaded)),
        map(([episode, episodesLoaded]) => {
          // Check if items are loaded, if not fetch from server
          if (!episodesLoaded && !this.episodeRequested) {
            console.log('No episode in store, fetching from server', episodeId);
            this.episodeRequested = true; // Prevents loading from firing more than needed
            this.store$.dispatch(new PodcastStoreActions.SingleEpisodeRequested({podcastId, episodeId}));
          }
          return episode;
        })
      );

    return podcastEpisode$;
  }

  private initializeHeroData(post: Post) {
    console.log('Initializing hero data with this post', post);
    this.heroData = {
      pageTitle: post.title,
      pageHeroSubtitle: null,
      imageProps: post.imageProps,
      actionMessage: 'Read More',
      isPost: true
    };

    if (post && !this.titleSet) {
      this.titleSet = true;
    }
  }

  private handlePostError() {
    this.errorSubscription = this.error$.subscribe(error => {
      if (error) {
        this.router.navigate([PublicAppRoutes.BLOG]);
        console.log('Post load error, routing to blog');
      }
    });
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }

    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

}
