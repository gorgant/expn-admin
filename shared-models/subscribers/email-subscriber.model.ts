import { PublicUser } from '../user/public-user.model';
import { SubscriptionSource } from './subscription-source.model';
import { GroupUnsubscribeRecordList, UnsubscribeRecord } from './group-unsubscribe-record.model';

export enum EmailSubscriberKeys {
  SUBSCRIPTION_SOURCES = 'subscriptionSources',
  MODIFIED_DATE = 'modifiedDate'
}

export interface EmailSubscriber {
  id: string; // email address of user
  publicUserData: PublicUser;
  createdDate: number;
  [EmailSubscriberKeys.MODIFIED_DATE]: number;
  lastSubSource: SubscriptionSource;
  [EmailSubscriberKeys.SUBSCRIPTION_SOURCES]: SubscriptionSource[];
  introEmailSent?: boolean;
  groupUnsubscribes?: GroupUnsubscribeRecordList;
  globalUnsubscribe?: UnsubscribeRecord;
  optInConfirmed?: boolean;
  optInTimestamp?: number;
  sendgridContactId?: string;
}

