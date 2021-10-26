import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { take, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AdminFunctionNames } from 'shared-models/routes-and-paths/fb-function-names';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private fns: AngularFireFunctions,
  ) { }

  sendSendgridTest(emailContent: string): Observable<string> {
    const sendgridHttpCall = this.fns.httpsCallable(AdminFunctionNames.SEND_SENDGRID_TEST);

    return sendgridHttpCall(emailContent)
      .pipe(
        take(1),
        tap(response => console.log('Sendgrid test sent', response)),
        catchError(error => {
          console.log('Error with sendgrid test', error);
          return throwError(error);
        })
      );
  }
}
