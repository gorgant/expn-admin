import { PublicUser } from '../user/public-user.model';

export interface Order {
  id: string;
  orderNumber: string; // A subset of id
  createdDate: number;
  stripeChargeId: string;
  stripeCustomerId: string;
  firstName: string;
  lastName: string;
  email: string;
  publicUser: PublicUser;
  productId: string;
  amountPaid: number;
  status: 'activated' | 'inactive';
}
