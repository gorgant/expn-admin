import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { SubCountData } from 'shared-models/subscribers/sub-count-data.model';
import { RootStoreState, SubscriberStoreActions, SubscriberStoreSelectors } from 'src/app/root-store';

@Component({
  selector: 'app-subscriber-count',
  templateUrl: './subscriber-count.component.html',
  styleUrls: ['./subscriber-count.component.scss']
})
export class SubscriberCountComponent implements OnInit, OnDestroy {

  subCountData$: Subject<SubCountData> = new Subject();
  subDataProcessing$: Subject<boolean> = new Subject();
  private subDataProcessingSub: Subscription;
  subDataProcessingError$: Subject<string> = new Subject();
  private subProcessingErrorSub: Subscription;

  subDataRequestDispatched: boolean;

  constructor(
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit(): void {
    this.monitorDataRequestProgress();
    this.monitorDataRequestErrors();
  }

  private prepUiForNextExport() {
    // this.unsubAllQuerySubs(); // Remove all existing subscriptions
    this.subDataProcessingError$.next(null); // Clear UI for next pull
    this.subCountData$.next(null); // Clear UI for next pull
    this.subDataRequestDispatched = false;
  }

  private dispatchDataRequest() {
    console.log('Requesting subscriber count');
    this.store$.dispatch(new SubscriberStoreActions.SubscriberCountRequested);
    this.subDataRequestDispatched = true;
  }

  onGetSubscriberCount() {
    this.prepUiForNextExport();
    this.dispatchDataRequest();
  }

  private monitorDataRequestProgress() {
    this.subDataProcessingSub = this.store$.select(SubscriberStoreSelectors.selectIsProcessingSubscriberCount)
      .pipe(
        withLatestFrom(this.store$.select(SubscriberStoreSelectors.selectSubscriberCountData))
      )
      .subscribe(([isProcessing, subCountData]) => {
        this.subDataProcessing$.next(isProcessing);
        if (!isProcessing && this.subDataRequestDispatched && subCountData) {
          this.subCountData$.next(subCountData)
        }
      })
    ;
  }

  private monitorDataRequestErrors() {
    
    this.subProcessingErrorSub = this.store$.select(SubscriberStoreSelectors.selectSubscriberCountError)
      .subscribe(error => {
        if (error) {
          this.subDataProcessingError$.next(error);
        }
      });
  }

  private unsubAllQuerySubs() {
    if (this.subDataProcessingSub) {
      this.subDataProcessingSub.unsubscribe();
    }

    if (this.subProcessingErrorSub) {
      this.subProcessingErrorSub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubAllQuerySubs();
  }

}
