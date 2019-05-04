export interface StripeChargeData {
  source: stripe.Source;
  anonymousUID: string;
  priceInCents: number;
}
