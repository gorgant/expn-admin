import { ImageProps } from '../images/image-props.model';
import { CheckoutData } from './checkout-data.model';
import { PageHeroData } from '../forms-and-components/page-hero-data.model';
import { BuyNowBoxData } from './buy-now-box-data.model';
import { ProductCardData } from './product-card-data.model';

export enum ProductKeys {
  NAME = 'name',
  PRICE = 'price',
  LIST_ORDER = 'listOrder',
  TAGLINE = 'tagline',
  PRODUCT_CATEGORY = 'productCategory'
}

export interface Product {
  id: string;
  [ProductKeys.NAME]: string;
  [ProductKeys.PRICE]: number;
  [ProductKeys.LIST_ORDER]: number;
  [ProductKeys.TAGLINE]: string;
  productCardData: ProductCardData;
  heroData: PageHeroData;
  buyNowData: BuyNowBoxData;
  checkoutData: CheckoutData;
  [ProductKeys.PRODUCT_CATEGORY]: ProductCategories;
  cardImageProps?: ImageProps;
  heroImageProps?: ImageProps;
  active?: boolean;
  readyToActivate?: boolean;
  imageSizes?: number[];
  imageFilePathList?: string[];
  imagesUpdated?: boolean;
}

export enum ProductCategories {
  WEBCOURSE = 'webcourse',
  SERVICE = 'service'
}

export interface ProductCategory {
  id: string;
  name: string;
}

export const ProductCategoryList: ProductCategory[] = [
  {
    id: ProductCategories.WEBCOURSE,
    name: 'Webcourse'
  },
  {
    id: ProductCategories.SERVICE,
    name: 'Service'
  }
];
