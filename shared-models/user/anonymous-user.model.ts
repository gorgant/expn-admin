import { BillingDetails } from '../billing/billing-details.model';

export interface AnonymousUser {
  id: string;
  lastAuthenticated: number;
  billingDetails?: BillingDetails | Partial<BillingDetails>;
  stripeCustomerId?: string;
  nextPaymentDue?: number;
  subscriptionTerminationDate?: number;
}
