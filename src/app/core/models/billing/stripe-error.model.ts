export interface StripeError {
  stripeErrorType: string;
  message: string;
  chargeId?: string;
}
