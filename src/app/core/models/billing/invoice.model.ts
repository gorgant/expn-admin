import { BillingDetails } from './billing-details.model';
import { CreditCardDetails } from './credit-card-details.model';

export interface Invoice {
  id?: string;
  anonymousUID: string;
  productName: string;
  productId: string;
  purchaseDate: number;
  purchasePrice: number;
  billingDetails: BillingDetails;
  creditCardDetails: CreditCardDetails;
  lastModified: number;
  orderNumber?: string; // A subset of invoiceId
  paymentComplete?: boolean;
}
