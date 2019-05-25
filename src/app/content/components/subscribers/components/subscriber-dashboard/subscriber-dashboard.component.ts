import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  RootStoreState,
  SubscriberStoreSelectors,
  SubscriberStoreActions,
  ContactFormStoreSelectors,
  ContactFormStoreActions
} from 'src/app/root-store';
import { EmailSubscriber } from 'src/app/core/models/subscribers/email-subscriber.model';
import { Observable, Subject } from 'rxjs';
import { map, takeWhile, withLatestFrom } from 'rxjs/operators';
import { ContactForm } from 'src/app/core/models/user/contact-form.model';
import { AdminAppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';

@Component({
  selector: 'app-subscriber-dashboard',
  templateUrl: './subscriber-dashboard.component.html',
  styleUrls: ['./subscriber-dashboard.component.scss']
})
export class SubscriberDashboardComponent implements OnInit {

  appRoutes = AdminAppRoutes;

  subscriber$: Subject<EmailSubscriber> = new Subject();
  private subscriberFetched: boolean;
  subscriberLoading$: Observable<boolean>;
  subscriberLoadError$: Subject<string> = new Subject();

  contactForms$: Subject<ContactForm[]> = new Subject();
  private contactFormsFetched: boolean;

  constructor(
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.subscriberLoading$ = this.store$.select(SubscriberStoreSelectors.selectSubscriberIsLoading);

  }

  onGetSubscriber(subscriberId: string) {

    const trimmedId = subscriberId.trim();

    this.subscriberFetched = false;
    this.subscriber$.next(null); // Clear UI for next pull
    this.subscriberLoadError$.next(null); // Clear UI for next pull
    this.contactForms$.next(null); // Clear UI for next pull


    this.getSubscriber(trimmedId); // Must execute before monitor errors
    this.monitorErrors();

  }

  private getSubscriber(subscriberId: string) {
    this.store$.select(SubscriberStoreSelectors.selectSubscriberById(subscriberId))
    .pipe(
      takeWhile(() => !this.subscriberFetched),
      map(subscriber => {
        if (!subscriber) {
          this.store$.dispatch(new SubscriberStoreActions.SingleSubscriberRequested({subscriberId}));
        }
        return subscriber;
      })
    ).subscribe(subscriber => {
      if (subscriber) {
        this.subscriber$.next(subscriber);
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
        if (error) {
          this.subscriberLoadError$.next(error);
          this.subscriberFetched = true; // Close out subscriber sub
        }
      });
  }

  onGetContactForms(subscriberId: string) {
    this.contactFormsFetched = false;

    this.getContactForms(subscriberId);
  }

  private getContactForms(subscriberId: string) {

    this.contactFormsFetched = false;

    this.store$.select(ContactFormStoreSelectors.selectSubscriberContactForms(subscriberId))
      .pipe(
        takeWhile(() => !this.contactFormsFetched),
        withLatestFrom(this.store$.select(ContactFormStoreSelectors.selectContactFormsLoaded)),
        map(([contactForms, contactFormsLoaded]) => {
          if (!contactFormsLoaded) {
            console.log('No contact forms, fetching from server');
            this.store$.dispatch(new ContactFormStoreActions.SubscriberContactFormsRequested({subscriberId}));
          }
          return contactForms;
        }),
        withLatestFrom(this.store$.select(ContactFormStoreSelectors.selectSubscriberContactFormsLoading)),
      ).subscribe(([contactForms, formsLoading]) => {
        console.log('Contact form subscription fired', contactForms);
        if (contactForms && !formsLoading) {
          this.contactForms$.next(contactForms);
          this.contactFormsFetched = true;
        }
      });
  }

}
