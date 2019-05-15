import { Order } from './order.model';

export interface OrderHistory {
  [stripeChargeId: string]: Order;
}
