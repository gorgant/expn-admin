import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactFormPageComponent } from './contact-form-page.component';

describe('ContactFormPageComponent', () => {
  let component: ContactFormPageComponent;
  let fixture: ComponentFixture<ContactFormPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
