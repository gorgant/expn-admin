import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { ContactForm } from 'src/app/core/models/user/contact-form.model';

export const featureAdapter: EntityAdapter<ContactForm>
  = createEntityAdapter<ContactForm>(
    {
      selectId: (contactForm: ContactForm) => contactForm.id,

      // Sort by date
      sortComparer: (a: ContactForm, b: ContactForm): number => {
        const contactFormCreatedDateA = a.createdDate;
        const contactFormCreatedDateB = b.createdDate;
        return contactFormCreatedDateB.toString().localeCompare(contactFormCreatedDateA.toString(), undefined, {numeric: true});
      }
    }
  );

export interface State extends EntityState<ContactForm> {
  isLoading: boolean;
  error: any;
  contactFormsLoaded: boolean;
  subscriberContactFormsLoading: boolean;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    error: null,
    contactFormsLoaded: false,
    subscriberContactFormsLoading: false,
  }
);
