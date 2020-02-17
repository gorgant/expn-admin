import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStoreState, PostStoreActions } from 'src/app/root-store';
import { EmailStoreActions, EmailStoreSelectors } from 'src/app/root-store/email-store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  testEmailProcessing$: Observable<boolean>;

  constructor(
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
  }

  monitorEmailTestDelivery() {
    this.testEmailProcessing$ = this.store$.select(EmailStoreSelectors.selectEmailSendProcessing);
  }

  onSendgridTest() {
    console.log('Send test email triggered');
    const emailContent = 'Empty test email message';
    this.store$.dispatch(new EmailStoreActions.SendTestEmailRequested({emailContent}));
  }

  onRefreshPublicBlogIndex() {
    console.log('Refresh public blog index triggered');
    this.store$.dispatch(new PostStoreActions.RefreshPublicBlogIndexRequested());
  }

  onRefreshPublicBlogCache() {
    console.log('Refresh public blog cache triggered');
    this.store$.dispatch(new PostStoreActions.RefreshPublicBlogCacheRequested());
  }

}
