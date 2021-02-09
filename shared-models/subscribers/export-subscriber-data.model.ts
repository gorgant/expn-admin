export interface ExportSubscriberData {
  id: string;
  createdDate: number;
  modifiedDate: number;
  lastSubSource: string;
  subSources: string;
  introEmailSent: number;
  globalUnsubscribe: number;
  optInConfirmed: number;
  optInTimestamp: number;
  sendgridContactId: string;
}
