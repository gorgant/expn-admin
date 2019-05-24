import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFormDashboardComponent } from './contact-form-dashboard.component';

describe('ContactFormDashboardComponent', () => {
  let component: ContactFormDashboardComponent;
  let fixture: ComponentFixture<ContactFormDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactFormDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
