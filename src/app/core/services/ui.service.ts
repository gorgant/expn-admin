import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  sideNavSignal$ = new Subject<void>();

  constructor(
    private snackbar: MatSnackBar,
  ) { }

  dispatchSideNavClick() {
    this.sideNavSignal$.next();
  }

  showSnackBar(message, action, duration: number) {
    const config = new MatSnackBarConfig();
    config.duration = duration;
    config.panelClass = ['custom-snack-bar']; // CSS managed in global styles.css

    const snackBarRef = this.snackbar.open(message, action, config);
  }


}
