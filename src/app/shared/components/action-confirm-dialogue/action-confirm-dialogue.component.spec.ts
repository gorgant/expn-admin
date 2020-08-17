import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionConfirmDialogueComponent } from './action-confirm-dialogue.component';

describe('ActionConfirmDialogueComponent', () => {
  let component: ActionConfirmDialogueComponent;
  let fixture: ComponentFixture<ActionConfirmDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionConfirmDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionConfirmDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
