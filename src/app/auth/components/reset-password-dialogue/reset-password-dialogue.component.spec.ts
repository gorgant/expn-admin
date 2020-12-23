import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResetPasswordDialogueComponent } from './reset-password-dialogue.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordDialogueComponent;
  let fixture: ComponentFixture<ResetPasswordDialogueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
