import { Component, OnInit, Input } from '@angular/core';
import { now } from 'moment';
import { LegalBusinessNames } from 'shared-models/forms-and-components/legal-vars.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() appVersion: string;
  showAppVersion = false;

  legalBusinessName = LegalBusinessNames.EXPLEARNING;

  currentDate: number;

  constructor( ) { }

  ngOnInit() {
    this.currentDate = now();
  }

  toggleShowAppVersion() {
    this.showAppVersion = !this.showAppVersion;
  }
}
