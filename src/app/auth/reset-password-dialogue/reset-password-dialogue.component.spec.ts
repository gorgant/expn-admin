import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordDialogueComponent } from './reset-password-dialogue.component';

describe('ResetPasswordDialogueComponent', () => {
  let component: ResetPasswordDialogueComponent;
  let fixture: ComponentFixture<ResetPasswordDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ResetPasswordDialogueComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
