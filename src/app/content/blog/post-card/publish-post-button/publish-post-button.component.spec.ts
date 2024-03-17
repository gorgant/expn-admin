import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishPostButtonComponent } from './publish-post-button.component';

describe('PublishPostButtonComponent', () => {
  let component: PublishPostButtonComponent;
  let fixture: ComponentFixture<PublishPostButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishPostButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublishPostButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
