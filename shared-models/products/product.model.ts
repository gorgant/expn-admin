import { ImageProps } from '../images/image-props.model';

export interface Product {
  id: string;
  name: string;
  price: number;
  checkoutHeader: string;
  description: string;
  mdBlurb: string;
  highlights: string[];
  imageProps?: ImageProps;
  active?: boolean;
  readyToActivate?: boolean;
  imageSizes?: number[];
  imageFilePathList?: string[];
  imagesUpdated?: boolean;
}
