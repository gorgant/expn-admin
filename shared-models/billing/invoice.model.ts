import { BillingDetails } from './billing-details.model';
import { CreditCardDetails } from './credit-card-details.model';

export interface Invoice {
  invoiceId?: string;
  anonymousUID: string;
  productName: string;
  productId: string;
  purchaseDate: number;
  purchasePrice: number;
  billingDetails: BillingDetails;
  creditCardDetails: CreditCardDetails;
  orderNumber?: string; // A subset of invoiceId
  paymentComplete?: boolean;
}
