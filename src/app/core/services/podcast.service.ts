import { Injectable, inject } from '@angular/core';
import { CollectionReference, DocumentReference, Firestore, Query, Timestamp, collection, collectionData, doc, docData, orderBy, query } from '@angular/fire/firestore';
import { UiService } from './ui.service';
import { PodcastEpisode, PodcastEpisodeKeys } from '../../../../shared-models/podcast/podcast-episode.model';
import { SharedCollectionPaths } from '../../../../shared-models/routes-and-paths/fb-collection-paths.model';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {

  private firestore = inject(Firestore);
  private uiService = inject(UiService);

  constructor() { }

  fetchAllPodcastEpisodes(podcastContainerId: string) {
    const podcastEpisodeCollectionRef = this.getPodcastEpisodeCollectionByDate(podcastContainerId);
    const podcastEpisodeCollectionDataRequest = collectionData(podcastEpisodeCollectionRef) as Observable<PodcastEpisode[]>;

    return podcastEpisodeCollectionDataRequest
      .pipe(
        map(podcastEpisodes => {
          if (!podcastEpisodes) {
            throw new Error(`Error fetching podcastEpisodes`);
          }
          const podcastEpisodesWithUpdatedTimestamps = podcastEpisodes.map(podcastEpisode => {
            const formattedPodcastEpisodes: PodcastEpisode = {
              ...podcastEpisode,
              [PodcastEpisodeKeys.PUBLISHED_TIMESTAMP]: (podcastEpisode[PodcastEpisodeKeys.PUBLISHED_TIMESTAMP] as Timestamp).toMillis(),
              [PodcastEpisodeKeys.LAST_MODIFIED_TIMESTAMP]: (podcastEpisode[PodcastEpisodeKeys.LAST_MODIFIED_TIMESTAMP] as Timestamp).toMillis(),
            };
            return formattedPodcastEpisodes;
          });
          console.log(`Fetched all ${podcastEpisodesWithUpdatedTimestamps.length} podcastEpisodes`);
          return podcastEpisodesWithUpdatedTimestamps;
        }),
        shareReplay(),
        catchError(error => {
          this.uiService.showSnackBar(error.message, 10000);
          console.log('Error fetching podcastEpisodes', error);
          return throwError(() => new Error(error));
        })
      );
  }

  fetchSinglePodcastEpisode(podcastContainerId: string, podcastEpisodeId: string): Observable<PodcastEpisode> {
    const podcastEpisodeRef = this.getPodcastEpisodeDoc(podcastContainerId, podcastEpisodeId);
    const podcastEpisode = docData(podcastEpisodeRef);

    return podcastEpisode
      .pipe(
        // If logged out, this triggers unsub of this observable
        map(podcastEpisode => {
          if (!podcastEpisode) {
            throw new Error(`Error fetching podcastEpisode with id: ${podcastContainerId}`);
          }
          const formattedPodcastEpisode: PodcastEpisode = {
            ...podcastEpisode,
            [PodcastEpisodeKeys.PUBLISHED_TIMESTAMP]: (podcastEpisode[PodcastEpisodeKeys.PUBLISHED_TIMESTAMP] as Timestamp).toMillis(),
            [PodcastEpisodeKeys.LAST_MODIFIED_TIMESTAMP]: (podcastEpisode[PodcastEpisodeKeys.LAST_MODIFIED_TIMESTAMP] as Timestamp).toMillis(),
          };
          console.log(`Fetched single podcastEpisode`, formattedPodcastEpisode);
          return formattedPodcastEpisode;
        }),
        shareReplay(),
        catchError(error => {
          this.uiService.showSnackBar(error.message, 10000);
          console.log(`Error fetching podcastEpisode`, error);
          return throwError(() => new Error(error));
        })
      );
  }

  private getPodcastEpisodeCollection(podcastContainerId: string): CollectionReference<PodcastEpisode> {
    return collection(this.firestore, `${SharedCollectionPaths.PODCAST_CONTAINERS}/${podcastContainerId}/${SharedCollectionPaths.PODCAST_EPISODES}`) as CollectionReference<PodcastEpisode>;
  }

  private getPodcastEpisodeCollectionByDate(podcastContainerId: string): Query<PodcastEpisode> {
    const podcastEpisodeCollectionRef = collection(this.firestore, `${SharedCollectionPaths.PODCAST_CONTAINERS}/${podcastContainerId}/${SharedCollectionPaths.PODCAST_EPISODES}`) as CollectionReference<PodcastEpisode>;
    const collectionRefOrderedByIndex = query(podcastEpisodeCollectionRef, orderBy(PodcastEpisodeKeys.PUBLISHED_TIMESTAMP, 'desc'));
    return collectionRefOrderedByIndex;
  }

  private getPodcastEpisodeDoc(podcastContainerId: string, podcastEpisodeId: string): DocumentReference<PodcastEpisode> {
    return doc(this.getPodcastEpisodeCollection(podcastContainerId), podcastEpisodeId);
  }

}
