import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeroComponent } from './page-hero.component';

describe('PageHeroComponent', () => {
  let component: PageHeroComponent;
  let fixture: ComponentFixture<PageHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
