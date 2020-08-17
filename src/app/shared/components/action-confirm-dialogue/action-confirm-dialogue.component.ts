import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionConfData } from 'shared-models/forms-and-components/action-conf-data.model';

@Component({
  selector: 'app-action-confirm-dialogue',
  templateUrl: './action-confirm-dialogue.component.html',
  styleUrls: ['./action-confirm-dialogue.component.scss']
})
export class ActionConfirmDialogueComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ActionConfirmDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public confData: ActionConfData,
  ) { }

  ngOnInit() {
  }

}
