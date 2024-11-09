import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UomconversionListComponent } from './uomconversion-list.component';

describe('UomconversionListComponent', () => {
  let component: UomconversionListComponent;
  let fixture: ComponentFixture<UomconversionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UomconversionListComponent]
    });
    fixture = TestBed.createComponent(UomconversionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
