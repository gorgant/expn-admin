import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, throwError, from } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { EmailSubscriber } from 'shared-models/subscribers/email-subscriber.model';
import { AdminCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private afs: AngularFirestore
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
          this.uiService.showSnackBar(error, null, 5000);
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
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );

    // const serverPromise: Promise<EmailSubscriber> = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     if (subscriberId === 'bob@tim.com') {
    //       resolve(demoSubscriber);
    //     } else {
    //       reject('No such id found');
    //     }
    //   }, 1000);
    // });

    // const serverResponse = serverPromise.then(subscriber => subscriber);

    // return from(serverResponse);
  }

  private getSubscribersCollection(): AngularFirestoreCollection<EmailSubscriber> {
    return this.afs.collection<EmailSubscriber>(AdminCollectionPaths.SUBSCRIBERS);
  }

  private getSubscriberDoc(subscriberId: string): AngularFirestoreDocument<EmailSubscriber> {
    return this.getSubscribersCollection().doc<EmailSubscriber>(subscriberId);
  }
}
