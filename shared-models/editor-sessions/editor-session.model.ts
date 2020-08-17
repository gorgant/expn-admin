import { SharedCollectionPaths, AdminCollectionPaths, PublicCollectionPaths } from '../routes-and-paths/fb-collection-paths';

export enum EditorSessionKeys {
  DOC_ID = 'docId',
  DOC_COLLECTION_PATH = 'docCollectionPath',
  ACTIVE = 'active'
}

export interface EditorSession {
  id: string;
  [EditorSessionKeys.DOC_ID]: string;
  [EditorSessionKeys.DOC_COLLECTION_PATH]: SharedCollectionPaths | AdminCollectionPaths | PublicCollectionPaths;
  [EditorSessionKeys.ACTIVE]: boolean;
  activatedTimestamp: number;
  lastModifiedTimestamp: number;
}

export enum EditorSessionVars {
  TIMEOUT_CHECK_INTERVAL = 1000 * 10, // Frequency with which to check local timeout
  INACTIVE_TIMEOUT_LIMIT = 1000 * 60 * 15 // Time before client auto-disconnects
}
