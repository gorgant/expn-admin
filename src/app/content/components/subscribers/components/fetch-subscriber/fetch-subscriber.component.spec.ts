import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchSubscriberComponent } from './fetch-subscriber.component';

describe('FetchSubscriberComponent', () => {
  let component: FetchSubscriberComponent;
  let fixture: ComponentFixture<FetchSubscriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FetchSubscriberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
