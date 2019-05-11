export interface Order {
  id: string;
  orderNumber: string; // A subset of id
  processedDate: number;
  stripeChargeId: string;
  stripeCustomerId: string;
  name: string;
  email: string;
  anonymousUID: string;
  productId: string;
  amountPaid: number;
  status: 'activated' | 'inactive';
}
