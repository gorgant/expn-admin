import { PublicUser } from '../user/public-user.model';
import { SubscriptionSource } from './subscription-source.model';
import { GroupUnsubscribeRecordList, UnsubscribeRecord } from './group-unsubscribe-record.model';

export interface EmailSubscriber {
  id: string; // email address of user
  publicUserData: PublicUser;
  createdDate: number;
  modifiedDate: number;
  lastSubSource: SubscriptionSource;
  subscriptionSources: SubscriptionSource[];
  introEmailSent?: boolean;
  groupUnsubscribes?: GroupUnsubscribeRecordList;
  globalUnsubscribe?: UnsubscribeRecord;
}
