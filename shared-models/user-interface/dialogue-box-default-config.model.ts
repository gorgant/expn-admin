import { MatDialogConfig } from "@angular/material/dialog";

export const DIALOGUE_BOX_DEFAULT_CONFIG_MOBILE: MatDialogConfig = {
  disableClose: false,
  autoFocus: false,
  panelClass: 'full-screen-dialog' // This is defined in the global styles.scss
};

export const DIALOGUE_BOX_DEFAULT_CONFIG_DESKTOP: MatDialogConfig = {
  disableClose: false,
  minWidth: '400px',
  minHeight: '300px',
  autoFocus: false
};

export const EMPTY_SPINNER_MESSAGE = 'none';