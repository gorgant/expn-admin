import { BillingDetails } from '../billing/billing-details.model';
import { CreditCardDetails } from '../billing/credit-card-details.model';

export interface AnonymousUser {
  id: string;
  lastAuthenticated: number;
  billingDetails?: BillingDetails;
  creditCardDetails?: CreditCardDetails;
}
