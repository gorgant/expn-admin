import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStoreState, SubscriberStoreSelectors, SubscriberStoreActions } from 'src/app/root-store';
import { EmailSubscriber } from 'src/app/core/models/subscribers/email-subscriber.model';
import { Observable, Subject } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-subscriber-dashboard',
  templateUrl: './subscriber-dashboard.component.html',
  styleUrls: ['./subscriber-dashboard.component.scss']
})
export class SubscriberDashboardComponent implements OnInit {

  subscriber$: Subject<EmailSubscriber> = new Subject();
  private subscriberFetched;
  subscriberLoading$: Observable<boolean>;
  subscriberLoadError$: Subject<string> = new Subject();

  constructor(
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.subscriberLoading$ = this.store$.select(SubscriberStoreSelectors.selectSubscriberIsLoading);

  }

  onGetSubscriber(subscriberId: string) {

    const trimmedId = subscriberId.trim();

    this.subscriberFetched = false;
    this.subscriber$.next(null);
    this.subscriberLoadError$.next(null);


    this.getSubscriber(trimmedId); // Must execute before monitor errors
    this.monitorErrors();

  }

  private getSubscriber(subscriberId: string) {
    this.store$.select(SubscriberStoreSelectors.selectSubscriberById(subscriberId))
    .pipe(
      takeWhile(() => !this.subscriberFetched),
      map(subscriber => {
        if (!subscriber) {
          console.log('Fetching subscriber from database');
          this.store$.dispatch(new SubscriberStoreActions.SingleSubscriberRequested({subscriberId}));
        }
        console.log('Returning subscriber', subscriber);
        return subscriber;
      })
    ).subscribe(subscriber => {
      console.log('Subscriber subscription fired', subscriber);
      if (subscriber) {
        this.subscriber$.next(subscriber);
        console.log('Subscriber detected', subscriber);
        this.subscriberFetched = true;
      }
    });
  }

  private monitorErrors() {
    this.store$.select(SubscriberStoreSelectors.selectSubscriberError)
      .pipe(
        takeWhile(() => !this.subscriberFetched)
      )
      .subscribe(error => {
        console.log('Error subscription fired', error);
        if (error) {
          this.subscriberLoadError$.next(error);
          this.subscriberFetched = true; // Close out subscriber sub
        }
      });
  }

}
