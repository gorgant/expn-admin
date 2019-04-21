import { BillingDetails } from './billing-details.model';
import { CreditCardDetails } from './credit-card-details.model';

export interface Invoice {
  invoiceId: string;
  productName: string;
  productId: string;
  purchaseDate: number;
  purchasePrice: number;
  customerId: string;
  billingDetails: BillingDetails;
  creditCardDetails: CreditCardDetails;
}
