import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBoilerplateDialogueComponent } from './post-boilerplate-dialogue.component';

describe('PostBoilerplateDialogueComponent', () => {
  let component: PostBoilerplateDialogueComponent;
  let fixture: ComponentFixture<PostBoilerplateDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostBoilerplateDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostBoilerplateDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
