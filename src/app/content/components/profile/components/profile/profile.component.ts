import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors } from 'src/app/root-store';
import { EditEmailDialogueComponent } from '../edit-email-dialogue/edit-email-dialogue.component';
import { EditNameDialogueComponent } from '../edit-name-dialogue/edit-name-dialogue.component';
import { EditPasswordDialogueComponent } from '../edit-password-dialogue/edit-password-dialogue.component';
import { AdminUser } from 'shared-models/user/admin-user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild('matButton') matButton;
  @ViewChild('matButton2') matButton2;
  @ViewChild('matButton3') matButton3;

  userLoading$: Observable<boolean>;
  adminUser$: Observable<AdminUser>;

  constructor(
    private store$: Store<RootStoreState.State>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.adminUser$ = this.store$.select(
      UserStoreSelectors.selectUser
    );

    this.userLoading$ = this.store$.select(
      UserStoreSelectors.selectUserIsLoading
    );

  }

  onEditName() {
    // This hacky solution is required to remove ripple effect from menu icon after closing sidenav
    this.matButton._elementRef.nativeElement.blur();

    this.adminUser$
      .pipe(take(1))
      .subscribe(user => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = user;

        const dialogRef = this.dialog.open(EditNameDialogueComponent, dialogConfig);
      });
  }

  onEditEmail() {
    // This hacky solution is required to remove ripple effect from menu icon after closing sidenav
    this.matButton2._elementRef.nativeElement.blur();

    this.adminUser$
      .pipe(take(1))
      .subscribe(user => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = user;

        const dialogRef = this.dialog.open(EditEmailDialogueComponent, dialogConfig);
      });
  }

  onEditPassword() {
    // This hacky solution is required to remove ripple effect from menu icon after closing sidenav
    this.matButton3._elementRef.nativeElement.blur();

    this.adminUser$
      .pipe(take(1))
      .subscribe(user => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = user;

        const dialogRef = this.dialog.open(EditPasswordDialogueComponent, dialogConfig);
      });
  }


}
