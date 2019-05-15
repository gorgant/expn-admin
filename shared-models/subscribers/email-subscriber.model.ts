import { PublicUser } from '../user/public-user.model';
import { SubscriptionSource } from './subscription-source.model';
import { OrderHistory } from '../orders/order-history.model';
import { Order } from '../orders/order.model';

export interface EmailSubscriber {
  id: string; // email address of user
  publicUserData: PublicUser;
  active: boolean;
  createdDate: number;
  modifiedDate: number;
  lastSubSource: SubscriptionSource;
  subscriptionSources: SubscriptionSource[];
  lastOrder: Order;
  orderHistory: OrderHistory;
  unsubscribedDate?: number;
}
