import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingSpinnerComponent } from './processing-spinner.component';

describe('ProcessingSpinnerComponent', () => {
  let component: ProcessingSpinnerComponent;
  let fixture: ComponentFixture<ProcessingSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ProcessingSpinnerComponent]
});
    fixture = TestBed.createComponent(ProcessingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
