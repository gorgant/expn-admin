import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Moment, now } from 'moment';
import { DATE_RANGE_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/admin-validation-messages.model';
import { ExportSubscribersParams } from 'shared-models/subscribers/export-subscriber-params.model';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {

  dateRangeForm: FormGroup;
  maxDate: Date;
  selectedStart: number;
  selectedEnd: number;

  dateRangeValidationMessages = DATE_RANGE_VALIDATION_MESSAGES;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DateRangePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public subExportData: ExportSubscribersParams
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.maxDate = new Date(now());
    console.log('Max date:', this.maxDate);
    this.dateRangeForm = this.fb.group({
      startDate: [new Date(now() - (1000 * 60 * 60 * 24 * 7)), Validators.required],
      endDate: [new Date(now()), Validators.required],
      queryLimit: [1000, [Validators.required, Validators.min(0), Validators.max(100000)]],
      includeUnconfirmedSubs: [false, Validators.required]
    })

    // Initialize default export values in case user doesn't interact with form
    this.selectedStart = (this.startDate.value as Moment)?.valueOf();
    this.selectedEnd = (this.endDate.value as Moment)?.valueOf();

  }

  onDateSelect(event: MatDateRangeInput<Date>) {
    this.selectedStart = (this.startDate.value as Moment)?.valueOf();
    this.selectedEnd = (this.endDate.value as Moment)?.valueOf();
    console.log(this.selectedStart);
    console.log(this.selectedEnd);
  }

  onConfirmExport() {
    this.subExportData = {
      startDate: this.selectedStart,
      endDate: this.selectedEnd,
      limit: this.queryLimit.value,
      includeUnconfirmedSubs: this.includeUnconfirmedSubs.value
    }
    this.dialogRef.close(this.subExportData);
  }

  get startDate() { return this.dateRangeForm.get('startDate'); }
  get endDate() { return this.dateRangeForm.get('endDate'); }
  get queryLimit() { return this.dateRangeForm.get('queryLimit'); }
  get includeUnconfirmedSubs() { return this.dateRangeForm.get('includeUnconfirmedSubs'); }

}
