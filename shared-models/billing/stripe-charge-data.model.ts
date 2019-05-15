import { Product } from '../products/product.model';

export interface StripeChargeData {
  source: stripe.Source;
  publicUserId: string;
  amountPaid: number;
  product: Product;
}
