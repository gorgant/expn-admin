import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { ExportSubscribersParams } from 'shared-models/subscribers/export-subscriber-params.model';
import { RootStoreState, SubscriberStoreActions, SubscriberStoreSelectors } from 'src/app/root-store';
import { DateRangePickerComponent } from 'src/app/shared/components/date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-export-subscribers',
  templateUrl: './export-subscribers.component.html',
  styleUrls: ['./export-subscribers.component.scss']
})
export class ExportSubscribersComponent implements OnInit, OnDestroy {

  downloadUrl$: Subject<string> = new Subject();
  exportProcessing$: Subject<boolean> = new Subject();
  private exportProgressSub: Subscription;
  exportError$: Subject<string> = new Subject();
  private exportErrorSub: Subscription;
  downloadHref: string;
  private subscriberExportDispatched = false;

  constructor(
    private store$: Store<RootStoreState.State>,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.monitorExportProgress();
    this.monitorExportErrors();
  }

  onExportSubscribers() {

    const dialogRef = this.dialog.open(DateRangePickerComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log('Export canceled');
        return;
      }
      const exportData = result as ExportSubscribersParams
      this.dispatchExportRequest(exportData);
    });
    
  }

  private prepUiForNextExport() {
    // this.unsubAllQuerySubs(); // Remove all existing subscriptions
    this.exportError$.next(null); // Clear UI for next pull
    this.downloadUrl$.next(null); // Clear UI for next pull
    this.downloadHref = undefined;
    this.subscriberExportDispatched = false;
  }

  private dispatchExportRequest(exportParams: ExportSubscribersParams) {
    console.log('Requesting subscriber export with these params', exportParams);
    this.prepUiForNextExport();
    
    this.store$.dispatch(new SubscriberStoreActions.ExportSubscribersRequested({exportParams}));
    this.subscriberExportDispatched = true;
    
  }

  private monitorExportProgress() {
    this.exportProgressSub = this.store$.select(SubscriberStoreSelectors.selectIsExportingSubscribers)
      .pipe(
        withLatestFrom(this.store$.select(SubscriberStoreSelectors.selectDownloadUrl))
      )
      .subscribe(([isProcessing, downloadUrl]) => {
        this.exportProcessing$.next(isProcessing);
        if (!isProcessing && this.subscriberExportDispatched && downloadUrl) {
          this.downloadHref = downloadUrl;
          this.downloadUrl$.next(downloadUrl)
        }
      })
    ;
  }

  private monitorExportErrors() {
    
    this.exportErrorSub = this.store$.select(SubscriberStoreSelectors.selectExportSubscribersError)
      .subscribe(error => {
        if (error) {
          this.exportError$.next(error);
        }
      });
  }

  private unsubAllQuerySubs() {
    if (this.exportErrorSub) {
      this.exportErrorSub.unsubscribe();
    }

    if (this.exportProgressSub) {
      this.exportProgressSub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubAllQuerySubs();
  }

}
