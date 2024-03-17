import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNameDialogueComponent } from './edit-name-dialogue.component';

describe('EditNameDialogueComponent', () => {
  let component: EditNameDialogueComponent;
  let fixture: ComponentFixture<EditNameDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditNameDialogueComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNameDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
