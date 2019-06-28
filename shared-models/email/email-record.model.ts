import { EmailEvent } from './email-event.model';
import { EmailEventType } from './email-event-type.model';

export type EmailRecord = {
  [key in EmailEventType]?: EmailEvent
};

export interface EmailRecordWithClicks extends EmailRecord {
  clickCount?: number;
}
