import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponDashboardComponent } from './coupon-dashboard.component';

describe('CouponDashboardComponent', () => {
  let component: CouponDashboardComponent;
  let fixture: ComponentFixture<CouponDashboardComponent>;

  beforeEach(async(() => {
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
