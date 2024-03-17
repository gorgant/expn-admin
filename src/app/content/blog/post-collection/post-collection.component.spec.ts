import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCollectionComponent } from './post-collection.component';

describe('PostCollectionComponent', () => {
  let component: PostCollectionComponent;
  let fixture: ComponentFixture<PostCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCollectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
