import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePostDialogueComponent } from './schedule-post-dialogue.component';

describe('SchedulePostDialogueComponent', () => {
  let component: SchedulePostDialogueComponent;
  let fixture: ComponentFixture<SchedulePostDialogueComponent>;

  beforeEach(async(() => {
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
