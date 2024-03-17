import { Timestamp } from '@angular/fire/firestore';
import { GoogleCloudFunctionsTimestamp } from '../firestore/google-cloud-functions-timestamp.model';

// The base pair
export interface UnsubscribeRecord {
  unsubscribeTimestamp: number | Timestamp | GoogleCloudFunctionsTimestamp;
  asm_group_id?: number;
}

// The object containing any number of base pairs
export interface UnsubscribeRecordList {
  [key: number]: UnsubscribeRecord;
}
