import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleFeaturedPostButtonComponent } from './toggle-featured-post-button.component';

describe('ToggleFeaturedPostButtonComponent', () => {
  let component: ToggleFeaturedPostButtonComponent;
  let fixture: ComponentFixture<ToggleFeaturedPostButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleFeaturedPostButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToggleFeaturedPostButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
