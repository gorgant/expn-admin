import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CouponDetailsComponent } from './coupon-details.component';

describe('CouponDetailsComponent', () => {
  let component: CouponDetailsComponent;
  let fixture: ComponentFixture<CouponDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
