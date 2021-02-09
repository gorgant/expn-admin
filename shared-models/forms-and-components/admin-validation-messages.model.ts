import { ProductKeys } from 'shared-models/products/product.model';
import { ProductCardKeys } from 'shared-models/products/product-card-data.model';
import { PageHeroKeys } from './page-hero-data.model';
import { BuyNowBoxKeys } from 'shared-models/products/buy-now-box-data.model';
import { CheckoutKeys } from 'shared-models/products/checkout-data.model';
import { PostKeys } from 'shared-models/posts/post.model';
import { DiscountCouponKeys } from 'shared-models/billing/discount-coupon.model';
import { AuthKeys } from 'shared-models/auth/auth-data.model';

export const LOGIN_VALIDATION_MESSAGES = {
  [AuthKeys.EMAIL]: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  [AuthKeys.PASSWORD]: [
    { type: 'required', message: 'Password is required.' },
  ]
};

export const RESET_PASSWORD_FROM_VALIDATION_MESSAGES = {
  [AuthKeys.EMAIL]: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
};

export const POST_FORM_VALIDATION_MESSAGES = {
  [PostKeys.BLOG_DOMAIN]: [
    {type: 'required', message: 'Blog domain is required.'}
  ],
  [PostKeys.TITLE]: [
    { type: 'required', message: 'Title is required.'},
  ],
  [PostKeys.VIDEO_URL]: [
    { type: 'required', message: 'Video URL is required.'},
    { type: 'pattern', message: 'Invalid url.' }
  ],
  [PostKeys.PODCAST_EPISODE_URL]: [
    { type: 'required', message: 'Podcast episode URL is required.'},
    { type: 'pattern', message: 'Invalid url.' }
  ],
  [PostKeys.DESCRIPTION]: [
    { type: 'required', message: 'Description is required'},
    { type: 'maxlength', message: 'Entry exceeds max length' }
  ],
  [PostKeys.KEYWORDS]: [
    { type: 'requried', message: 'Keywords are required'},
    { type: 'maxlength', message: 'Entry exceeds max length' }
  ],
};

export const PRODUCT_FORM_VALIDATION_MESSAGES = {
  [ProductKeys.NAME]: [
    { type: 'required', message: 'Name is required.'},
  ],
  [ProductKeys.PRICE]: [
    { type: 'required', message: 'Price is required.'},
  ],
  [ProductKeys.LIST_ORDER]: [
    { type: 'required', message: 'List order is required.'},
  ],
  [ProductKeys.TAGLINE]: [
    { type: 'required', message: 'Tagline is required.'},
  ],
  [ProductKeys.PRODUCT_CATEGORY]: [
    { type: 'required', message: 'Tagline is required.'},
  ],
  [ProductKeys.SKILLSHARE_URL]: [
    { type: 'pattern', message: 'Invalid url.' }
  ],
  [ProductCardKeys.HIGHLIGHTS]: [
    { type: 'required', message: 'Highlight cannot be blank.'},
  ],
  [PageHeroKeys.PAGE_HERO_SUBTITLE]: [
    { type: 'required', message: 'Hero subtitle required.'},
  ],
  [BuyNowBoxKeys.BUY_NOW_BOX_SUBTITLE]: [
    { type: 'required', message: 'Buy now box subtitle required.'},
  ],
  [CheckoutKeys.CHECKOUT_HEADER]: [
    { type: 'required', message: 'Checkout header is required.'},
  ],
  [CheckoutKeys.CHECKOUT_DESCRIPTION]: [
    { type: 'required', message: 'Checkout description is required.'},
  ],
};

export const EMAIL_FORM_VALIDATION_MESSAGES = {
  [AuthKeys.EMAIL]: [
    { type: 'required', message: 'You must provide an email.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  [AuthKeys.PASSWORD]: [
    { type: 'required', message: 'You must confirm your current password.'},
  ]
};

export const NAME_FORM_VALIDATION_MESSAGES = {
  [AuthKeys.NAME]: [
    { type: 'required', message: 'You must provide a name.'},
  ]
};

export const PASSWORD_FORM_VALIDATION_MESSAGES = {
  oldPassword: [
    { type: 'required', message: 'You must provide your current password.'},
  ],
  newPassword: [
    { type: 'required', message: 'You must provide a new password.'},
    { type: 'minlength', message: 'Must be at least 6 characters' },
  ],
  confirmNewPassword: [
    { type: 'required', message: 'You must confirm your new password.'},
  ],
  updatedPwGroup: [
    { type: 'noMatch', message: 'Your new passwords must match.'},
  ],
  oldPwGroup: [
    { type: 'match', message: 'Your new password cannot match your old password.'}
  ]
};

export const SCHEDULE_POST_FORM_VALIDATION_MESSAGES = {
  [PostKeys.PUBLISHED_DATE]: [
    { type: 'required', message: 'You must provide a scheduled date.'},
  ],
  publishHour: [
    { type: 'required', message: 'Provide an hour between 0 and 23'},
    { type: 'min', message: 'Value must be between 0 and 23.'},
    { type: 'max', message: 'Value be between 0 and 23.'},
  ],
  publishMin: [
    { type: 'required', message: 'Provide a minute between 0 and 60'},
    { type: 'min', message: 'Value must be between 0 and 59.'},
    { type: 'max', message: 'Value must be between 0 and 59.'},
  ]
};

export const COUPON_FORM_VALIDATION_MESSAGES = {
  [DiscountCouponKeys.COUPON_CODE]: [
    {type: 'required', message: 'This field is required.'},
    {type: 'pattern', message: 'Coupon code can only contain letters and numbers with no spaces.'},
  ],
  [DiscountCouponKeys.DISCOUNT_PERCENTAGE]: [
    { type: 'required', message: 'This field is required.'},
    { type: 'max', message: 'Value cannot exceed 100'},
    { type: 'min', message: 'Value cannot be less than 1'},
  ],
  [DiscountCouponKeys.EXPIRATION_DATE]: [
    { type: 'required', message: 'This field is required.'},
  ],
  expirationHour: [
    { type: 'required', message: 'Provide an hour between 0 and 23'},
    { type: 'min', message: 'Value must be between 0 and 23.'},
    { type: 'max', message: 'Value be between 0 and 23.'},
  ],
  expirationMin: [
    { type: 'required', message: 'Provide a minute between 0 and 60'},
    { type: 'min', message: 'Value must be between 0 and 59.'},
    { type: 'max', message: 'Value must be between 0 and 59.'},
  ],
  [DiscountCouponKeys.MAX_USES]: [
    { type: 'required', message: 'This field is required.'},
    { type: 'min', message: 'Value cannot be less than 1.' }
  ],
  [DiscountCouponKeys.USER_SPECIFIC]: [
    { type: 'required', message: 'This field is required.'},
  ],
  [DiscountCouponKeys.PRODUCT_SPECIFIC]: [
    { type: 'required', message: 'This field is required.'},
  ],
  [DiscountCouponKeys.MAX_USES_PER_USER]: [
    { type: 'min', message: 'Value cannot be less than 1.'},
    { type: 'max', message: 'Value cannot exceed overall max use limit above.'},
  ],
};

export const DATE_RANGE_VALIDATION_MESSAGES = {
  startDate: [
    { type: 'required', message: 'This field is required.'},
    { type: 'matStartDateInvalid', message: 'Invalid start date.'}
  ],
  endDate: [
    { type: 'required', message: 'This field is required.'},
    { type: 'matStartDateInvalid', message: 'Invalid end date.'}
  ],
  queryLimit: [
    { type: 'required', message: 'This field is required.'},
    { type: 'min', message: 'Value must be 0 or greater.'},
    { type: 'max', message: 'Value must be below 100,000.'}
  ]
}
