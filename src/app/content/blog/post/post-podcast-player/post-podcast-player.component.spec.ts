import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPodcastPlayerComponent } from './post-podcast-player.component';

describe('PostPodcastPlayerComponent', () => {
  let component: PostPodcastPlayerComponent;
  let fixture: ComponentFixture<PostPodcastPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPodcastPlayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostPodcastPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
