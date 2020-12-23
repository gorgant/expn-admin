import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveEditorSessionsDialogueComponent } from './active-editor-sessions-dialogue.component';

describe('ActiveEditorSessionsDialogueComponent', () => {
  let component: ActiveEditorSessionsDialogueComponent;
  let fixture: ComponentFixture<ActiveEditorSessionsDialogueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveEditorSessionsDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveEditorSessionsDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
