import { AnonymousUser } from '../user/anonymous-user.model';
import { SubscriptionSource } from './subscription-source.model';

export interface EmailSubscriber {
  id: string; // email address of user
  publicUserData: AnonymousUser;
  active: boolean;
  createdDate: number;
  subscriptionSources: SubscriptionSource[];
  lastSubSource: SubscriptionSource;
  lastUpdated: number;
  unsubscribedDate?: number;
}
