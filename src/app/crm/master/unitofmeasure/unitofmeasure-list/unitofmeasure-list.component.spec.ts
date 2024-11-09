import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitofmeasureListComponent } from './unitofmeasure-list.component';

describe('UnitofmeasureListComponent', () => {
  let component: UnitofmeasureListComponent;
  let fixture: ComponentFixture<UnitofmeasureListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitofmeasureListComponent]
    });
    fixture = TestBed.createComponent(UnitofmeasureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
