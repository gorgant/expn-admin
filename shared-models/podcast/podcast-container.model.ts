import { Timestamp } from '@angular/fire/firestore';
import { GoogleCloudFunctionsTimestamp } from "../firestore/google-cloud-functions-timestamp.model";

export interface PodcastContainer {
  id: string;
  rssUrl: string;
  title: string;
  description: string;
  imageUrl: string;
  authorWebsite: string;
  lastModifiedTimestamp: number | Timestamp | GoogleCloudFunctionsTimestamp;
}
