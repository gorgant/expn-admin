export enum CheckoutKeys {
  CHECKOUT_HEADER = 'checkoutHeader',
  CHECKOUT_DESCRIPTION = 'checkoutDescription'
}

export interface CheckoutData {
  [CheckoutKeys.CHECKOUT_HEADER]: string;
  [CheckoutKeys.CHECKOUT_DESCRIPTION]: string;
}
