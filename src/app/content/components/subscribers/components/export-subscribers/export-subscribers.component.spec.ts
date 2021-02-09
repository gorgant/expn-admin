import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportSubscribersComponent } from './export-subscribers.component';

describe('ExportSubscribersComponent', () => {
  let component: ExportSubscribersComponent;
  let fixture: ComponentFixture<ExportSubscribersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportSubscribersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
