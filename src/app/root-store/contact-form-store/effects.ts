import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as contactFormFeatureActions from './actions';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { ContactFormService } from 'src/app/core/services/contact-form.service';

@Injectable()
export class ContactFormStoreEffects {
  constructor(
    private actions$: Actions,
    private contactFormService: ContactFormService
  ) { }

  @Effect()
  singleContactFormRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<contactFormFeatureActions.SingleContactFormRequested>(
      contactFormFeatureActions.ActionTypes.SINGLE_CONTACT_FORM_REQUESTED
    ),
    mergeMap(action =>
      this.contactFormService.fetchSingleContactForm(action.payload.contactFormId)
        .pipe(
          map(contactForm => new contactFormFeatureActions.SingleContactFormLoaded({ contactForm })),
          catchError(error => {
            return of(new contactFormFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  allContactFormsRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<contactFormFeatureActions.AllContactFormsRequested>(
      contactFormFeatureActions.ActionTypes.ALL_CONTACT_FORMS_REQUESTED
    ),
    switchMap(action =>
      this.contactFormService.fetchAllContactForms()
        .pipe(
          map(contactForms => new contactFormFeatureActions.AllContactFormsLoaded({ contactForms })),
          catchError(error => {
            return of(new contactFormFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

  @Effect()
  subscriberContactFormsRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<contactFormFeatureActions.SubscriberContactFormsRequested>(
      contactFormFeatureActions.ActionTypes.SUBSCRIBER_CONTACT_FORMS_REQUESTED
    ),
    switchMap(action =>
      this.contactFormService.fetchSubscriberContactForms(action.payload.subscriberId)
        .pipe(
          map(contactForms => {
            if (contactForms.length < 1) {
              throw new Error('No contact forms for subscriber');
            }
            return new contactFormFeatureActions.SubscriberContactFormsLoaded({ contactForms });
          }),
          catchError(error => {
            return of(new contactFormFeatureActions.LoadErrorDetected({ error }));
          })
        )
    )
  );

}
