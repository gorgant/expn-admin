import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportConfigDialogueComponent } from './export-config-dialogue.component';

describe('ExportConfigDialogueComponent', () => {
  let component: ExportConfigDialogueComponent;
  let fixture: ComponentFixture<ExportConfigDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportConfigDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportConfigDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
