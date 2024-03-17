import { Timestamp } from '@angular/fire/firestore';
import { GoogleCloudFunctionsTimestamp } from '../firestore/google-cloud-functions-timestamp.model';

export enum PostBoilerplateKeys {
  CONTENT = 'content',
  CREATED_TIMESTAMP = 'createdTimestamp',
  ID = 'id',
  LAST_MODIFIED_TIMESTAMP = 'lastModifiedTimestamp'
}

export interface PostBoilerplate {
  [PostBoilerplateKeys.CONTENT]: string;
  [PostBoilerplateKeys.CREATED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
  [PostBoilerplateKeys.ID]: string;
  [PostBoilerplateKeys.LAST_MODIFIED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
}

export const POST_BOILERPLATE_DOCUMENT_ID = 'post-boilerplate'; // Document is stored in the adminResources collection