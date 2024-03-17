import { SharedCollectionPaths, AdminCollectionPaths, PublicCollectionPaths } from '../routes-and-paths/fb-collection-paths.model';
import { Timestamp } from '@angular/fire/firestore';
import { GoogleCloudFunctionsTimestamp } from '../firestore/google-cloud-functions-timestamp.model';

export enum EditorSessionKeys {
  ACTIVE = 'active',
  ACTIVATED_TIMESTAMP = 'activatedTimestamp',
  DOC_ID = 'docId',
  DOC_COLLECTION_PATH = 'docCollectionPath',
  ID = 'id',
  LAST_MODIFIED_TIMESTAMP = 'lastModifiedTimestamp',
}

export interface EditorSession {
  [EditorSessionKeys.ACTIVE]: boolean;
  [EditorSessionKeys.ACTIVATED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
  [EditorSessionKeys.DOC_ID]: string;
  [EditorSessionKeys.DOC_COLLECTION_PATH]: SharedCollectionPaths | AdminCollectionPaths | PublicCollectionPaths;
  [EditorSessionKeys.ID]: boolean;
  [EditorSessionKeys.LAST_MODIFIED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
}

export enum EditorSessionVars {
  TIMEOUT_CHECK_INTERVAL = 1000 * 10, // Frequency with which to check local timeout
  INACTIVE_TIMEOUT_LIMIT = 1000 * 60 * 15 // Time before client auto-disconnects
}
