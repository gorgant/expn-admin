import { EmailEvent } from './email-event.model';
import { EmailEventType } from './email-event-type.model';

export enum EmailRecordKeys {
  CLICK_COUNT = 'clickCount'
}

export type EmailRecord = {
  [key in EmailEventType]?: EmailEvent
};

export interface EmailRecordWithClicks extends EmailRecord {
  [EmailRecordKeys.CLICK_COUNT]?: number;
}
