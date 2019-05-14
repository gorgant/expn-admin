import { AnonymousUser } from '../user/anonymous-user.model';
import { SubscriptionSource } from './subscription-source.model';

export interface EmailSubData {
  user: AnonymousUser;
  subSource: SubscriptionSource;
}
