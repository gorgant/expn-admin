import { Product } from '../products/product.model';

export interface StripeChargeData {
  source: stripe.Source;
  anonymousUID: string;
  amountPaid: number;
  product: Product;
}
