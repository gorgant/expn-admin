import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPublicUsersComponent } from './import-public-users.component';

describe('ImportPublicUsersComponent', () => {
  let component: ImportPublicUsersComponent;
  let fixture: ComponentFixture<ImportPublicUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportPublicUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportPublicUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
