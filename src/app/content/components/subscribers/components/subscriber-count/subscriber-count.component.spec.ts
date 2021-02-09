import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberCountComponent } from './subscriber-count.component';

describe('SubscriberCountComponent', () => {
  let component: SubscriberCountComponent;
  let fixture: ComponentFixture<SubscriberCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriberCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
