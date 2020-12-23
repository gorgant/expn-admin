import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubscriberDashboardComponent } from './subscriber-dashboard.component';

describe('SubscriberDashboardComponent', () => {
  let component: SubscriberDashboardComponent;
  let fixture: ComponentFixture<SubscriberDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
