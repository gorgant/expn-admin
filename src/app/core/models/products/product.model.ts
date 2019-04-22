import { ProductCardData } from './product-card-data.model';
import { PageHeroData } from '../forms-and-components/page-hero-data.model';
import { BuyNowBoxData } from './buy-now-box-data.model';
import { CheckoutData } from './checkout-data.model';
import { ImageProps } from '../images/image-props.model';

export interface Product {
  id: string;
  name: string;
  price: number;
  listOrder: number;
  tagline: string;
  productCardData: ProductCardData;
  heroData: PageHeroData;
  buyNowData: BuyNowBoxData;
  checkoutData: CheckoutData;
  cardImageProps?: ImageProps;
  heroImageProps?: ImageProps;
  active?: boolean;
  readyToActivate?: boolean;
  imageSizes?: number[];
  imageFilePathList?: string[];
  imagesUpdated?: boolean;
}
