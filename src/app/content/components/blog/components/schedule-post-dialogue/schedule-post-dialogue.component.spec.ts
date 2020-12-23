import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchedulePostDialogueComponent } from './schedule-post-dialogue.component';

describe('SchedulePostDialogueComponent', () => {
  let component: SchedulePostDialogueComponent;
  let fixture: ComponentFixture<SchedulePostDialogueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulePostDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePostDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
