import { Product } from '../products/product.model';
import { DiscountCouponChild } from './discount-coupon.model';
import { Stripe as StripeDefs} from 'stripe';

export interface StripeChargeData {
  source: StripeDefs.Source;
  publicUserId: string;
  product: Product;
  quantity: number;
  discountCoupon: DiscountCouponChild;
}
