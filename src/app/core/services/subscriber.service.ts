import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { EmailSubscriber } from '../models/subscribers/email-subscriber.model';
import { Observable, throwError, of, from } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { AdminCollectionPaths } from '../models/routes-and-paths/fb-collection-paths';
import { demoSubscriber } from '../models/demo/demo-data.model';

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
    // const subscriberDoc = this.getSubscriberDoc(subscriberId);
    // return subscriberDoc.valueChanges()
    //   .pipe(
    //     takeUntil(this.authService.unsubTrigger$),
    //     map(subscriber => {
    //       console.log('Fetched single subscriber', subscriber);
    //       return subscriber;
    //     }),
    //     catchError(error => {
    //       this.uiService.showSnackBar(error, null, 5000);
    //       return throwError(error);
    //     })
    //   );

    const demoServerPromise: Promise<EmailSubscriber> = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (subscriberId === 'bob@tim.com') {
          resolve(demoSubscriber);
        } else {
          reject('No subscriber found');
        }
      }, 1000);
    });

    const serverResponse = demoServerPromise.then(subscriber => subscriber);



    return from(serverResponse);

  }

  private getSubscribersCollection(): AngularFirestoreCollection<EmailSubscriber> {
    return this.afs.collection<EmailSubscriber>(AdminCollectionPaths.SUBSCRIBERS);
  }

  private getSubscriberDoc(subscriberId: string): AngularFirestoreDocument<EmailSubscriber> {
    return this.getSubscribersCollection().doc<EmailSubscriber>(subscriberId);
  }
}
