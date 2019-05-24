import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ContactForm } from 'src/app/core/models/user/contact-form.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Store } from '@ngrx/store';
import { RootStoreState, ContactFormStoreSelectors, ContactFormStoreActions } from 'src/app/root-store';
import { Router } from '@angular/router';
import { AdminAppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { withLatestFrom, map } from 'rxjs/operators';

@Component({
  selector: 'app-contact-form-dashboard',
  templateUrl: './contact-form-dashboard.component.html',
  styleUrls: ['./contact-form-dashboard.component.scss']
})
export class ContactFormDashboardComponent implements OnInit, OnDestroy {

  contactForms$: Observable<ContactForm[]>;
  contactFormSubscription: Subscription;

  displayedColumns = ['createdDate', 'name', 'email'];
  dataSource = new MatTableDataSource<ContactForm>();
  isLoading$: Observable<boolean>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private store$: Store<RootStoreState.State>,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initializeContactForms();
    this.initializeMatTable();
  }

  onSelectContactForm(contactForm: ContactForm) {
    this.router.navigate([AdminAppRoutes.CONTACT_FORM_DETAILS, contactForm.id]);
  }

  private initializeContactForms() {
    this.isLoading$ = this.store$.select(ContactFormStoreSelectors.selectContactFormIsLoading);

    this.contactForms$ = this.store$.select(ContactFormStoreSelectors.selectAllContactForms)
      .pipe(
        withLatestFrom(
          this.store$.select(ContactFormStoreSelectors.selectContactFormsLoaded)
        ),
        map(([contactForms, contactFormsLoaded]) => {
          // Check if items are loaded, if not fetch from server
          if (!contactFormsLoaded) {
            this.store$.dispatch(new ContactFormStoreActions.AllContactFormsRequested());
          }
          return contactForms;
        })
      );
  }

  private initializeMatTable() {
    this.contactFormSubscription = this.contactForms$.subscribe(contactForms => this.dataSource.data = contactForms); // Supply data
    this.dataSource.sort = this.sort; // Configure sorting on headers
    this.dataSource.paginator = this.paginator; // Configure pagination
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.contactFormSubscription) {
      this.contactFormSubscription.unsubscribe();
    }
  }

}
