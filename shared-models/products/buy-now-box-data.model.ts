export enum BuyNowBoxKeys {
  BUY_NOW_BOX_SUBTITLE = 'buyNowBoxSubtitle'
}

export interface BuyNowBoxData {
  title: string;
  [BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE]: string;
  buttonText?: string;
}
