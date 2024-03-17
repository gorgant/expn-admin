import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpublishPostButtonComponent } from './unpublish-post-button.component';

describe('UnpublishPostButtonComponent', () => {
  let component: UnpublishPostButtonComponent;
  let fixture: ComponentFixture<UnpublishPostButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnpublishPostButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnpublishPostButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
