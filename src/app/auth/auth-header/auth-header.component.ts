import { Component, OnInit } from '@angular/core';
import { GlobalFieldValues } from '../../../../shared-models/content/string-vals.model';
import { ShorthandBusinessNames } from '../../../../shared-models/meta/business-info.model';

@Component({
    selector: 'app-auth-header',
    templateUrl: './auth-header.component.html',
    styleUrls: ['./auth-header.component.scss'],
    standalone: true
})
export class AuthHeaderComponent implements OnInit {

  AUTH_HEADER = ShorthandBusinessNames.EXPN;
  AUTH_SUB_HEADER = GlobalFieldValues.ADMIN_LOGIN;

  constructor() { }

  ngOnInit(): void {
  }

}
