import { PublicUser } from '../user/public-user.model';
import { SubscriptionSource } from './subscription-source.model';
import * as Stripe from 'stripe';

export interface EmailSubData {
  user: PublicUser;
  subSource: SubscriptionSource;
  stripeCharge?: Stripe.charges.ICharge;
}
