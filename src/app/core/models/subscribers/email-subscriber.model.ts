import { PublicUser } from '../user/public-user.model';
import { SubscriptionSource } from './subscription-source.model';

export interface EmailSubscriber {
  id: string; // email address of user
  publicUserData: PublicUser;
  active: boolean;
  createdDate: number;
  modifiedDate: number;
  lastSubSource: SubscriptionSource;
  subscriptionSources: SubscriptionSource[];
  unsubscribedDate?: number;
  introEmailSent?: boolean;
}
