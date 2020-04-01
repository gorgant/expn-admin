import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, throwError, from, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { ContactForm } from 'shared-models/user/contact-form.model';
import { AdminCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private afs: AngularFirestore
  ) { }

  fetchAllContactForms(): Observable<ContactForm[]> {
    const contactFormCollection = this.getContactFormsCollection();
    return contactFormCollection.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(contactForms => {
          console.log('Fetched all contactForms', contactForms);
          return contactForms;
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          return throwError(error);
        })
      );
  }

  fetchSingleContactForm(contactFormId: string): Observable<ContactForm> {
    const contactFormDoc = this.getContactFormDoc(contactFormId);
    return contactFormDoc.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(contactForm => {
          console.log('Fetched single contactForm', contactForm);
          return contactForm;
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          return throwError(error);
        })
      );
  }

  fetchSubscriberContactForms(subscriberId: string): Observable<ContactForm[]> {
    console.log('Fetching contact forms for this subscriber', subscriberId);
    const subContactFormCollection = this.getSubscriberContactForms(subscriberId);
    return subContactFormCollection.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(contactForms => {
          console.log('Fetched subscriber contact forms', contactForms);
          return contactForms;
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          return throwError(error);
        })
      );
    // const serverPromise: Promise<ContactForm[]> = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     console.log('Returning contact forms from server');
    //     resolve(demoContactForms);
    //   }, 1000);
    // });

    // const serverResponse = serverPromise.then(contactForms => contactForms);

    // return from(serverResponse);
  }

  private getContactFormsCollection(): AngularFirestoreCollection<ContactForm> {
    return this.afs.collection<ContactForm>(AdminCollectionPaths.CONTACT_FORMS);
  }

  private getContactFormDoc(contactFormId: string): AngularFirestoreDocument<ContactForm> {
    return this.getContactFormsCollection().doc<ContactForm>(contactFormId);
  }

  private getSubscriberContactForms(subscriberId: string): AngularFirestoreCollection<ContactForm> {
    return this.afs.collection<ContactForm>(AdminCollectionPaths.CONTACT_FORMS, ref => ref.where('email', '==', subscriberId));
  }
}
