import { Product } from '../products/product.model';

// Used to allow dynamic query fields in Firestore
export enum DiscountCouponKeys {
  ACTIVE = 'active',
  COUPON_CODE = 'couponCode',
  CREATED_DATE = 'createdDate',
  DISCOUNT_PERCENTAGE = 'discountPercentage',
  EXPIRATION_DATE = 'expirationDate',
  MAX_USES = 'maxUses',
  MAX_USES_PER_USER = 'maxUsesPerUser',
  APPROVED_PRODUCT_IDS = 'approvedProductIds',
  PRODUCT_ID_LIST = 'productIdList',
  USE_COUNT = 'useCount',
  USE_TIMESTAMPS = 'useTimestamps',
  USER_EMAIL = 'userEmail',
  USER_ID = 'userId',
  USER_SPECIFIC = 'userSpecific',
  PRODUCT_SPECIFIC = 'productSpecific'
}

export interface DiscountCouponChild {
  [DiscountCouponKeys.COUPON_CODE]: string;
  [DiscountCouponKeys.DISCOUNT_PERCENTAGE]: number;
  valid?: boolean;
  invalidReason?: string;
}

export interface DiscountCouponParent extends DiscountCouponChild {
  [DiscountCouponKeys.EXPIRATION_DATE]: number;
  [DiscountCouponKeys.USE_COUNT]: number;
  [DiscountCouponKeys.MAX_USES]: number;
  [DiscountCouponKeys.USER_SPECIFIC]: boolean;
  [DiscountCouponKeys.PRODUCT_SPECIFIC]: boolean;
  [DiscountCouponKeys.CREATED_DATE]: number;
  modifiedDate: number;
  creatorId: string;
  [DiscountCouponKeys.ACTIVE]: boolean;
  [DiscountCouponKeys.MAX_USES_PER_USER]?: number;
  [DiscountCouponKeys.APPROVED_PRODUCT_IDS]?: string[];
}

export interface DiscountCouponUser {
  [DiscountCouponKeys.USER_EMAIL]: string;
  [DiscountCouponKeys.USER_ID]: string;
  [DiscountCouponKeys.USE_COUNT]: number;
  [DiscountCouponKeys.USE_TIMESTAMPS]: number[];
  [DiscountCouponKeys.PRODUCT_ID_LIST]: string[];
}

export interface DiscountCouponValidationData {
  couponCode: string;
  [DiscountCouponKeys.USER_EMAIL]: string;
  [DiscountCouponKeys.USER_ID]: string;
  product: Product;
  isStripeCharge: boolean;
}

export enum DiscountCouponErrors {
  DEFAULT = 'Invalid coupon.',
  DOES_NOT_EXIST = 'Coupon does not exist.',
  NOT_ACTIVE = 'Coupon is not active.',
  EXCEEDED_MAX_USES = 'Coupon exceeded maximum uses.',
  EXPIRED = 'Coupon has expired.',
  EXCEEDED_VALIDATION_ATTEMPTS = 'You have exceed the max allowed validation attempts.',
  EXCEEDED_MAX_USES_PER_USER = 'Coupon exceeded usage limit.',
  FORM_NOT_COMPLETE = 'Please complete the billing details above before applying your coupon.',
  INVALID_PRODUCT = 'Coupon is not valid for this product.',
  SYSTEM_ERROR = 'System error. Please contact support.'
}
