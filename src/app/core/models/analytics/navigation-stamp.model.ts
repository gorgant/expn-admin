export interface NavigationStamp {
  id: string;
  pagePath: string;
  pageOpenTime: number;
  sessionId: string;
  pageCloseTime?: number;
  pageViewDuration?: number;
}
