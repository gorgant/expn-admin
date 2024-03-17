import { Component, OnInit, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GlobalFieldValues } from '../../../../../shared-models/content/string-vals.model';
import { ActionConfData } from '../../../../../shared-models/forms/action-conf-data.model';

@Component({
    selector: 'app-action-confirm-dialogue',
    templateUrl: './action-confirm-dialogue.component.html',
    styleUrls: ['./action-confirm-dialogue.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatDialogClose]
})
export class ActionConfirmDialogueComponent implements OnInit {

  YES_BUTTON_VALUE = GlobalFieldValues.YES;
  NO_BUTTON_VALUE = GlobalFieldValues.NO;
  
  private dialogRef = inject(MatDialogRef<ActionConfirmDialogueComponent>);
  public confData = inject<ActionConfData>(MAT_DIALOG_DATA)

  constructor() { }

  ngOnInit() {
  }

}
