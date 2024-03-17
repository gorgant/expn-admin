import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostVideoPlayerComponent } from './post-video-player.component';

describe('PostVideoPlayerComponent', () => {
  let component: PostVideoPlayerComponent;
  let fixture: ComponentFixture<PostVideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostVideoPlayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
