import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactForm } from 'src/app/core/models/user/contact-form.model';
import { Store } from '@ngrx/store';
import { RootStoreState, ContactFormStoreSelectors, ContactFormStoreActions } from 'src/app/root-store';
import { ActivatedRoute } from '@angular/router';
import { withLatestFrom, map } from 'rxjs/operators';

@Component({
  selector: 'app-contact-form-page',
  templateUrl: './contact-form-page.component.html',
  styleUrls: ['./contact-form-page.component.scss']
})
export class ContactFormPageComponent implements OnInit {

  contactForm$: Observable<ContactForm>;
  private contactFormLoaded: boolean;

  constructor(
    private store$: Store<RootStoreState.State>,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loadExistingContactFormData();
  }

  private loadExistingContactFormData() {
    // Check if id params are available
    const idParamName = 'id';
    const idParam = this.route.snapshot.params[idParamName];
    if (idParam) {
      console.log('ContactForm detected with id', idParam);
      this.contactForm$ = this.getContactForm(idParam);
    }
  }

  private getContactForm(contactFormId: string): Observable<ContactForm> {
    console.log('Getting contactForm', contactFormId);
    return this.store$.select(ContactFormStoreSelectors.selectContactFormById(contactFormId))
    .pipe(
      withLatestFrom(
        this.store$.select(ContactFormStoreSelectors.selectContactFormsLoaded)
      ),
      map(([contactForm, contactFormsLoaded]) => {
        // Check if items are loaded, if not fetch from server
        if (!contactFormsLoaded && !this.contactFormLoaded) {
          console.log('No contactForm in store, fetching from server', contactFormId);
          this.store$.dispatch(new ContactFormStoreActions.SingleContactFormRequested({contactFormId}));
        }
        console.log('Single contactForm status', this.contactFormLoaded);
        this.contactFormLoaded = true; // Prevents loading from firing more than needed
        return contactForm;
      })
    );
  }

}
