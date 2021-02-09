import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { EmailSubscriber } from 'shared-models/subscribers/email-subscriber.model';
import { ContactForm } from 'shared-models/user/contact-form.model';
import { RootStoreState, SubscriberStoreSelectors, ContactFormStoreActions, SubscriberStoreActions, ContactFormStoreSelectors } from 'src/app/root-store';

@Component({
  selector: 'app-fetch-subscriber',
  templateUrl: './fetch-subscriber.component.html',
  styleUrls: ['./fetch-subscriber.component.scss']
})
export class FetchSubscriberComponent implements OnInit {

  appRoutes = AdminAppRoutes;

  subscriber$: Subject<EmailSubscriber> = new Subject();
  subscriberLoading$: Observable<boolean>;
  subscriberLoadError$: Subject<string> = new Subject();
  private subscriberRequestDispatched: boolean;
  private subscriberStoreSub: Subscription;
  private subscriberErrorSub: Subscription;

  contactForms$: Subject<ContactForm[]> = new Subject();
  private contactFormRequestDispatched: boolean;
  private contactFormStoreSub: Subscription;

  constructor(
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.subscriberLoading$ = this.store$.select(SubscriberStoreSelectors.selectIsLoading);
  }

  onGetSubscriber(subscriberId: string) {

    const trimmedId = subscriberId.trim();

    this.unsubAllQuerySubs(); // Remove all existing subscriptions
    this.subscriber$.next(null); // Clear UI for next pull
    this.subscriberLoadError$.next(null); // Clear UI for next pull
    this.contactForms$.next(null); // Clear UI for next pull
    this.store$.dispatch(new ContactFormStoreActions.ResetSubscriberContactFormsStatus()); // Clear Store state

    this.getSubscriber(trimmedId);
    this.monitorErrors();
  }

  private getSubscriber(subscriberId: string) {
    console.log('Getting subscriber', subscriberId);
    this.subscriberRequestDispatched = false;

    this.subscriberStoreSub = this.store$.select(SubscriberStoreSelectors.selectSubscriberById(subscriberId))
    .pipe(
      map(subscriber => {
        if (!subscriber && !this.subscriberRequestDispatched) {
          this.store$.dispatch(new SubscriberStoreActions.SingleSubscriberRequested({subscriberId}));
          this.subscriberRequestDispatched = true;
        }
        return subscriber;
      })
    ).subscribe(subscriber => {
      if (subscriber) {
        this.subscriber$.next(subscriber);
        this.getContactForms(subscriber.id); // Once subscriber loaded, get contact forms
      }
    });
  }

  private monitorErrors() {
    this.subscriberErrorSub = this.store$.select(SubscriberStoreSelectors.selectLoadError)
      .subscribe(error => {
        if (error) {
          this.subscriberLoadError$.next(error);
        }
      });
  }

  private getContactForms(subscriberId: string) {

    console.log('Getting contact form for ', subscriberId);
    this.contactFormRequestDispatched = false;

    this.contactFormStoreSub = this.store$.select(ContactFormStoreSelectors.selectSubscriberContactForms(subscriberId))
      .pipe(
        map((contactForms) => {
          if (contactForms.length < 1 && !this.contactFormRequestDispatched) {
            console.log('No contact forms, fetching from server', subscriberId);
            this.store$.dispatch(new ContactFormStoreActions.SubscriberContactFormsRequested({subscriberId}));
            this.contactFormRequestDispatched = true;
          }
          return contactForms;
        }),
        withLatestFrom(
          this.store$.select(ContactFormStoreSelectors.selectSubscriberContactFormsLoaded),
          this.store$.select(ContactFormStoreSelectors.selectContactFormError)
        ),
      ).subscribe(([contactForms, formsLoaded, error]) => {
        console.log('Contact form subscription fired', contactForms, formsLoaded, subscriberId);
        if (contactForms.length > 0) {
          console.log('Piping in contact forms', contactForms);
          this.contactForms$.next(contactForms);
        }
        if (error) {
          console.log('Error retrieving forms', error.message);
        }
      });
  }

  private unsubAllQuerySubs() {
    // Remove any previous subscriber subscription if it exists
    if (this.subscriberStoreSub) {
      this.subscriberErrorSub.unsubscribe();
    }

    // Remove any previous contact form subscription if it exists
    if (this.contactFormStoreSub) {
      this.contactFormStoreSub.unsubscribe();
    }

    // Remove any previous error if it exists
    if (this.subscriberErrorSub) {
      this.subscriberErrorSub.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubAllQuerySubs();
  }

}
