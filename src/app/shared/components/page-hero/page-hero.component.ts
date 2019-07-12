import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PageHeroData } from 'src/app/core/models/forms-and-components/page-hero-data.model';
import { PublicImagePaths } from 'src/app/core/models/routes-and-paths/image-paths.model';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-page-hero',
  templateUrl: './page-hero.component.html',
  styleUrls: ['./page-hero.component.scss']
})
export class PageHeroComponent implements OnInit, OnDestroy {

  @Input() heroData: PageHeroData;

  @ViewChild('contentStartTag', { static: true }) ContentStartTag: ElementRef;


  imageUrl: string;
  pageTitle: string;
  pageSubtitle: string;
  actionMessage: string;

  private screenObserverSubscription: Subscription;
  stylesObject: {};

  isPost: boolean;
  fxLayoutAlignValue: string;

  heroBackgroundImageAlignValue = 'center start';
  heroContentContainerAlignValue = 'end start';
  heroContentContainerFlexValue = '50';
  heroContentContainerMobileFlexValue = '60';
  heroActionContainerFlexValue = '50';
  heroActionContainerMobileFlexValue = '40';

  constructor(
    private sanitizer: DomSanitizer,
    private uiService: UiService
  ) { }

  ngOnInit() {

    this.initializeInputData();

    this.configureBackgroundStyleObject();
  }

  private initializeInputData() {
    this.pageTitle = this.heroData.pageTitle;
    this.pageSubtitle = this.heroData.pageSubtitle;
    this.actionMessage = this.heroData.actionMessage;

    if (this.heroData.isPost) {
      this.initalizePostConfig();
    } else {
      this.initalizeNonPostConfig();
    }

  }

  private initalizePostConfig() {
    this.isPost = true;
    this.heroBackgroundImageAlignValue = 'center center';
    this.heroContentContainerAlignValue = 'end center';
    this.heroContentContainerFlexValue = '70';
    this.heroActionContainerFlexValue = '30';
    this.heroContentContainerMobileFlexValue = '70';
    this.heroActionContainerMobileFlexValue = '30';

    this.imageUrl = PublicImagePaths.POST_HERO; // Fixed post image
  }

  private initalizeNonPostConfig() {
    this.imageUrl = this.heroData.imageProps.src;
  }

  scrollToTextStart() {
    this.ContentStartTag.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private configureBackgroundStyleObject() {

    // Get screen size before setting config
    this.screenObserverSubscription = this.uiService.screenIsMobile$
      .subscribe(screenIsMobile => {

        const backgroundImageUrl = `url(${this.imageUrl})`;
        let linearGradient = 'linear-gradient(0deg, rgba(0,0,0,0.5) 10%, rgba(9,9,121,0.006) 100%)';

        if (this.isPost) {
          linearGradient = 'linear-gradient(0deg, rgba(0,0,0,0.6) 100%, rgba(9,9,121,0.006) 100%)';
        }

        // Increase linear gradient if on mobile for better readability
        if (screenIsMobile) {
          console.log('Screen is mobile');
          linearGradient = 'linear-gradient(0deg, rgba(0,0,0,0.5) 100%, rgba(9,9,121,0.006) 100%)';
        }

        const combinedStyles = `${linearGradient}, ${backgroundImageUrl}`; // Layer in the gradient

        const safeStyles = this.sanitizer.bypassSecurityTrustStyle(`${combinedStyles}`); // Mark string as safe

        this.stylesObject = safeStyles;
      });

  }

  ngOnDestroy() {
    if (this.screenObserverSubscription) {
      this.screenObserverSubscription.unsubscribe();
    }
  }

}
