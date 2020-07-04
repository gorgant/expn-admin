import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveEditorSessionsDialogueComponent } from './active-editor-sessions-dialogue.component';

describe('ActiveEditorSessionsDialogueComponent', () => {
  let component: ActiveEditorSessionsDialogueComponent;
  let fixture: ComponentFixture<ActiveEditorSessionsDialogueComponent>;

  beforeEach(async(() => {
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
