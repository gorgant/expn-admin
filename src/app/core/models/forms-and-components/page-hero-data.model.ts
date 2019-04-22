import { ImageProps } from '../images/image-props.model';

export interface PageHeroData {
  pageTitle: string;
  pageSubtitle: string;
  imageProps?: ImageProps;
  actionMessage?: string;
  isPost?: boolean;
}
