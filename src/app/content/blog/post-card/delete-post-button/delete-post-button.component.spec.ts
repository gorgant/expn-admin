import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePostButtonComponent } from './delete-post-button.component';

describe('DeletePostButtonComponent', () => {
  let component: DeletePostButtonComponent;
  let fixture: ComponentFixture<DeletePostButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePostButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePostButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
