export interface NavigationStamp {
  id: string;
  pagePath: string;
  pageLocation: string;
  pageOpenTime: number;
  sessionId: string;
  pageCloseTime?: number;
  pageViewDuration?: number;
}
