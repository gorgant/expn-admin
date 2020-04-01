import { ImageProps } from '../images/image-props.model';

export enum PageHeroKeys {
  PAGE_HERO_SUBTITLE = 'pageHeroSubtitle'
}

export interface PageHeroData {
  pageTitle: string;
  [PageHeroKeys.PAGE_HERO_SUBTITLE]: string;
  imageProps?: ImageProps;
  actionMessage?: string;
  isPost?: boolean;
}
