import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePostDialogueComponent } from './schedule-post-dialogue.component';

describe('SchedulePostDialogueComponent', () => {
  let component: SchedulePostDialogueComponent;
  let fixture: ComponentFixture<SchedulePostDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulePostDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchedulePostDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
