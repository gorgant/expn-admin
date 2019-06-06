import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromContactForms from './reducer';
import { ContactForm } from 'src/app/core/models/user/contact-form.model';

const getIsLoading = (state: State): boolean => state.isLoading;
const getContactFormsLoaded = (state: State): boolean => state.contactFormsLoaded;
const getSubscriberContactFormsLoading = (state: State): boolean => state.subscriberContactFormsLoading;
const getSubscriberContactFormsLoaded = (state: State): boolean => state.subscriberContactFormsLoaded;
const getError = (state: State): any => state.error;

export const selectContactFormState: MemoizedSelector<object, State>
= createFeatureSelector<State>('contactForms');

export const selectAllContactForms: (state: object) => ContactForm[] = createSelector(
  selectContactFormState,
  fromContactForms.selectAll
);

export const selectSubscriberContactForms: (subscriberId: string) => MemoizedSelector<object, ContactForm[]>
= (subscriberId: string) => createSelector(
  selectAllContactForms,
  contactForms => contactForms.filter(contactForm => contactForm.email === subscriberId)
);

export const selectContactFormById: (contactFormId: string) => MemoizedSelector<object, ContactForm>
= (contactFormId: string) => createSelector(
  selectContactFormState,
  contactFormState => contactFormState.entities[contactFormId]
);

export const selectContactFormError: MemoizedSelector<object, any> = createSelector(
  selectContactFormState,
  getError
);

export const selectContactFormIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectContactFormState, getIsLoading);

export const selectContactFormsLoaded: MemoizedSelector<object, boolean>
= createSelector(selectContactFormState, getContactFormsLoaded);

export const selectSubscriberContactFormsLoading: MemoizedSelector<object, boolean>
= createSelector(selectContactFormState, getSubscriberContactFormsLoading);

export const selectSubscriberContactFormsLoaded: MemoizedSelector<object, boolean>
= createSelector(selectContactFormState, getSubscriberContactFormsLoaded);


