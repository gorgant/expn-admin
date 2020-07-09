import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AngularFirestore } from '@angular/fire/firestore';
import { GeographicData } from 'shared-models/forms-and-components/geography/geographic-data.model';
import { SharedCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';
import { take, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  sideNavSignal$ = new Subject<void>();
  screenIsMobile$ = new BehaviorSubject(true);

  constructor(
    private snackbar: MatSnackBar,
    private afs: AngularFirestore,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.monitorScreenSize();
   }

  dispatchSideNavClick() {
    this.sideNavSignal$.next();
  }

  showSnackBar(message: string, duration: number, action: string = 'Dismiss', ) {
    const config = new MatSnackBarConfig();
    config.duration = duration;
    config.panelClass = ['custom-snack-bar']; // CSS managed in global styles.css

    const snackBarRef = this.snackbar.open(message, action, config);

    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }

  fetchGeographicData(): Observable<GeographicData> {
    const geographicDataDoc = this.afs.collection(SharedCollectionPaths.PUBLIC_RESOURCES)
      .doc<GeographicData>(SharedCollectionPaths.GEOGRAPHIC_DATA);

    return geographicDataDoc.valueChanges()
      .pipe(
        take(1),
        map(geographicData => {
          console.log('Fetched geographic data', geographicData);
          return geographicData;
        }),
        catchError(error => {
          this.showSnackBar(error, 5000);
          return throwError(error);
        })
      );
  }

  monitorScreenSize() {
    this.breakpointObserver.observe(['(max-width: 959px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          console.log('Mobile screen detected');
          this.screenIsMobile$.next(true);
        } else {
          console.log('Desktop screen detected');
          this.screenIsMobile$.next(false);
        }
      });

  }

  // Remove spaces from url string
  removeSpacesFromString(stringWithSpaces: string): string {
    return stringWithSpaces.replace(/\s/g, '');
  }

  // Replace spaces with dashes and set lower case
  convertToFriendlyUrlFormat(stringWithSpaces: string): string {
    return stringWithSpaces.split(' ').join('-').toLowerCase();
  }

  // Firebase can't handle back slashes
  createOrReverseFirebaseSafeUrl = (url: string, reverse?: boolean): string => {
    if (reverse) {
      const urlWithSlashes = url.replace(/~1/g, '/'); // Revert to normal url
      return urlWithSlashes;
    }
    const removedProtocol = url.split('//').pop() as string;
    const replacedSlashes = removedProtocol.replace(/\//g, '~1');
    return replacedSlashes;
  }

  getPodcastId = (podcastRssUrl: string): string => {
    return podcastRssUrl.split('users:')[1].split('/')[0];
  }

  /**
   * Rounds a number to the nearest digits desired
   * @param numb Number to round
   * @param digitsToRoundTo Number of digits desired
   */
  // Courtesy of: https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
  generateRoundedNumber(numb: number, digitsToRoundTo: number) {
    let n = numb;
    let digits = digitsToRoundTo;
    let negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if ( n < 0) {
      negative = true;
      n = n * -1;
    }
    const multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = parseFloat((Math.round(n) / multiplicator).toFixed(2));
    if ( negative ) {
        n = parseFloat((n * -1).toFixed(2));
    }
    return n;
  }


}
