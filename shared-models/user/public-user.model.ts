import { BillingDetails } from '../billing/billing-details.model';
import { OrderHistory } from '../orders/order-history.model';

export interface PublicUser {
  id: string;
  lastAuthenticated: number;
  modifiedDate: number;
  createdDate?: number;
  billingDetails?: BillingDetails | Partial<BillingDetails>;
  stripeCustomerId?: string;
  orderHistory?: OrderHistory;
  optInConfirmed?: boolean;
}
