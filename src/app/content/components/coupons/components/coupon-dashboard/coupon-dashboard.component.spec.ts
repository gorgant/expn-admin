import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CouponDashboardComponent } from './coupon-dashboard.component';

describe('CouponDashboardComponent', () => {
  let component: CouponDashboardComponent;
  let fixture: ComponentFixture<CouponDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
