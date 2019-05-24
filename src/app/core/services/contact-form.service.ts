import { Injectable } from '@angular/core';
import { ContactForm } from '../models/user/contact-form.model';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, throwError, from } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { AdminCollectionPaths } from '../models/routes-and-paths/fb-collection-paths';

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
          this.uiService.showSnackBar(error, null, 5000);
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
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  private getContactFormsCollection(): AngularFirestoreCollection<ContactForm> {
    return this.afs.collection<ContactForm>(AdminCollectionPaths.CONTACT_FORMS);
  }

  private getContactFormDoc(contactFormId: string): AngularFirestoreDocument<ContactForm> {
    return this.getContactFormsCollection().doc<ContactForm>(contactFormId);
  }
}
