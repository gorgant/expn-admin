export enum EmailEventType {
  PROCESSED = 'processed',
  DROPPED = 'dropped',
  DELIVERED = 'delievered',
  DEFERRED = 'deferred',
  BOUNCE = 'bounce',
  OPEN = 'open',
  CLICK = 'click',
  SPAM_REPORT = 'spamreport',
  UNSUBSCRIBE = 'unsubscribe',
  GROUP_UNSUBSCRIBE = 'group_unsubscribe',
  GROUP_RESUBSCRIBE = 'group_resubscribe',
}
