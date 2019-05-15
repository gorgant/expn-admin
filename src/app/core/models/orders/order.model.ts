export interface Order {
  id: string;
  orderNumber: string; // A subset of id
  createdDate: number;
  stripeChargeId: string;
  stripeCustomerId: string;
  name: string;
  email: string;
  publicUserId: string;
  productId: string;
  amountPaid: number;
  status: 'activated' | 'inactive';
}
