import { CreditCardDetails } from './credit-card-details.model';
import { BillingDetails } from './billing-details.model';

export interface Invoice {
  id: string;
  orderNumber: string; // A subset of invoiceId
  anonymousUID: string;
  productName: string;
  productId: string;
  purchasePrice: number;
  billingDetails: BillingDetails;
  creditCardDetails: CreditCardDetails;
  lastModified: number;
  orderSubmitted?: boolean; // Set when user clicks purchase
  submittedDate?: number; // Set when user clicks purchase
  paymentComplete?: boolean; // Set when server confirms payment has been processed
  inoviceClosedDate?: number; // Set when payment is complete
  previousPaymentAttempts?: Invoice[]; // Invoice added if a payment fails
}
