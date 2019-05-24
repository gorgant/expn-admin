import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberDashboardComponent } from './subscriber-dashboard.component';

describe('SubscriberDashboardComponent', () => {
  let component: SubscriberDashboardComponent;
  let fixture: ComponentFixture<SubscriberDashboardComponent>;

  beforeEach(async(() => {
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
