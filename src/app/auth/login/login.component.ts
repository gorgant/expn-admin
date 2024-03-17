import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { LoginFormComponent } from '../login-form/login-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, AsyncPipe } from '@angular/common';
import { AuthHeaderComponent } from '../auth-header/auth-header.component';
import { ProcessingSpinnerComponent } from '../../shared/components/processing-spinner/processing-spinner.component';
import { GlobalFieldValues } from '../../../../shared-models/content/string-vals.model';
import { AdminUser } from '../../../../shared-models/user/admin-user.model';
import { AuthResultsData } from '../../../../shared-models/auth/auth-data.model';
import { AuthStoreSelectors, UserStoreSelectors } from '../../root-store';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [AuthHeaderComponent, NgClass, MatButtonModule, MatIconModule, LoginFormComponent, RouterLink, ProcessingSpinnerComponent, AsyncPipe]
})
export class LoginComponent implements OnInit {

  AUTH_PROCESSING_BLURB = GlobalFieldValues.AUTH_PROCESSING;

  authOrUserUpdateProcessing$!: Observable<boolean>;
  userData$!: Observable<AdminUser>;
  authData$!: Observable<AuthResultsData>;

  private store$ = inject(Store);

  constructor() { }

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    this.authOrUserUpdateProcessing$ = combineLatest(
      [
        this.store$.select(AuthStoreSelectors.selectEmailAuthProcessing),
        this.store$.select(UserStoreSelectors.selectUpdateAdminUserProcessing),
        this.store$.select(UserStoreSelectors.selectFetchAdminUserProcessing)
      ]
    ).pipe(
        map(([authProcessing, updateProcessing, fetchProcessing]) => {
          if (authProcessing || updateProcessing || fetchProcessing) {
            return true
          }
          return false
        })
    );
    
    this.userData$ = this.store$.select(UserStoreSelectors.selectAdminUserData) as Observable<AdminUser>;
    this.authData$ = this.store$.select(AuthStoreSelectors.selectAuthResultsData) as Observable<AuthResultsData>;
  }



}
