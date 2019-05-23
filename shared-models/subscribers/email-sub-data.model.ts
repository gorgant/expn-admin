import { PublicUser } from '../user/public-user.model';
import { SubscriptionSource } from './subscription-source.model';

export interface EmailSubData {
  user: PublicUser;
  subSource: SubscriptionSource;
}
