export interface Webpage {
  expires: number;
  userAgent: string;
  payload: string;
  saved: number;
  url: string;
  htmlSegmentIdArray?: string[];
  segmentId?: string;
  segmentCharLength?: number;
  pageCharLength?: number;
}
