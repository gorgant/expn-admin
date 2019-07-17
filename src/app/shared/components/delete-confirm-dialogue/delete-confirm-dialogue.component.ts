import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DeleteConfData } from 'shared-models/forms-and-components/delete-conf-data.model';

@Component({
  selector: 'app-delete-confirm-dialogue',
  templateUrl: './delete-confirm-dialogue.component.html',
  styleUrls: ['./delete-confirm-dialogue.component.scss']
})
export class DeleteConfirmDialogueComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public confData: DeleteConfData,
  ) { }

  ngOnInit() {
  }

}
