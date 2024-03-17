import { Component, Input, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GlobalFieldValues } from '../../../../../shared-models/content/string-vals.model';
import { EMPTY_SPINNER_MESSAGE } from '../../../../../shared-models/user-interface/dialogue-box-default-config.model';

@Component({
    selector: 'app-processing-spinner',
    templateUrl: './processing-spinner.component.html',
    styleUrls: ['./processing-spinner.component.scss'],
    standalone: true,
    imports: [MatProgressSpinnerModule]
})
export class ProcessingSpinnerComponent {
  DEFAULT_SPINNER_MESSAGE = GlobalFieldValues.REQUEST_PROCESSING;
  EMPTY_MESSAGE = EMPTY_SPINNER_MESSAGE;

  $spinnerMessage = input<string>();
  $spinnerDiameter = input<number>(96);
  $spinnerMargin = input<string>('0 0 0 0');
}
