import * as Stripe from 'stripe';
import { StripeOwnerAddress } from './stripe-owner-address.model';

export interface StripeCustomerUpdate extends Stripe.customers.ICustomerUpdateOptions {
  name?: string;
  phone?: string;
  address?: StripeOwnerAddress;
}
