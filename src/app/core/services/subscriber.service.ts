import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { takeUntil, map, catchError, take, tap } from 'rxjs/operators';
import { EmailSubscriber } from 'shared-models/subscribers/email-subscriber.model';
import { AdminCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';
import { ExportSubscribersParams } from 'shared-models/subscribers/export-subscriber-params.model';
import { AdminFunctionNames } from 'shared-models/routes-and-paths/fb-function-names';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { SubCountData } from 'shared-models/subscribers/sub-count-data.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private afs: AngularFirestore,
    private fns: AngularFireFunctions,
  ) { }

  fetchAllSubscribers(): Observable<EmailSubscriber[]> {
    const subscriberCollection = this.getSubscribersCollection();
    return subscriberCollection.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(subscribers => {
          console.log('Fetched all subscribers', subscribers);
          return subscribers;
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          return throwError(error);
        })
      );
  }

  fetchSingleSubscriber(subscriberId: string): Observable<EmailSubscriber> {
    console.log('Getting subscriber with this id', subscriberId);
    const subscriberDoc = this.getSubscriberDoc(subscriberId);
    return subscriberDoc.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(subscriber => {
          console.log('Fetched single subscriber', subscriber);
          return subscriber;
        }),
        catchError(error => {
          console.log('Error fetching subscriber', error);
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          return throwError(error);
        })
      );
  }

  exportSubscribers(exportParams: ExportSubscribersParams): Observable<string> {
    const exportSubscribersHttpCall: (exportParams: ExportSubscribersParams) => Observable<string> = this.fns.httpsCallable(
      AdminFunctionNames.EXPORT_SUBSCRIBERS
    );

    const exportSubscriberRes = exportSubscribersHttpCall(exportParams)
      .pipe(
        take(1),
        tap(downloadUrl => {
          console.log('Export subscribers processed, returning this URL', downloadUrl);
          // throw new Error('Fake subscriber export error');
        }),
        catchError(error => {
          console.log('Error exporting subscribers', error);
          return throwError(error);
        })
      );
    return exportSubscriberRes;
  }

  fetchSubscriberCount(): Observable<SubCountData> {
    const fetchSubscriberCountHttpCall: (data: string) => Observable<SubCountData> = this.fns.httpsCallable(
      AdminFunctionNames.GET_SUBSCRIBER_COUNT
    );

    const dummyData = 'Sub count requested'

    const fetchSubscriberCountRes = fetchSubscriberCountHttpCall(dummyData)
      .pipe(
        take(1),
        tap(subCountData => {
          console.log('Fetch subscriber count processed, returning this data', subCountData);
          // throw new Error('Fake subscriber export error');
        }),
        catchError(error => {
          console.log('Error fetching subscriber count', error);
          return throwError(error);
        })
      );
    return fetchSubscriberCountRes;
  }

  private getSubscribersCollection(): AngularFirestoreCollection<EmailSubscriber> {
    return this.afs.collection<EmailSubscriber>(AdminCollectionPaths.SUBSCRIBERS);
  }

  private getSubscriberDoc(subscriberId: string): AngularFirestoreDocument<EmailSubscriber> {
    return this.getSubscribersCollection().doc<EmailSubscriber>(subscriberId);
  }
}
