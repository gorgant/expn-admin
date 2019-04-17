import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/core/services/public.service';

@Component({
  selector: 'app-data-imports',
  templateUrl: './data-imports.component.html',
  styleUrls: ['./data-imports.component.scss']
})
export class DataImportsComponent implements OnInit {

  constructor(
    private publicService: PublicService
  ) { }

  ngOnInit() {
  }

  onUpdateCountryList() {
    this.publicService.updateCountryList();
  }

  onUpdateUsStateList() {
    this.publicService.updateUsStateList();
  }

}
