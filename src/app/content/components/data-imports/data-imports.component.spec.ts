import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataImportsComponent } from './data-imports.component';

describe('DataImportsComponent', () => {
  let component: DataImportsComponent;
  let fixture: ComponentFixture<DataImportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataImportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataImportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
