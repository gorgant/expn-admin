// The base pair
export interface UnsubscribeRecord {
  unsubscribeDate: number;
  asm_group_id?: number;
}

// The object containing any number of base pairs
export interface GroupUnsubscribeRecordList {
  [key: number]: UnsubscribeRecord;
}
