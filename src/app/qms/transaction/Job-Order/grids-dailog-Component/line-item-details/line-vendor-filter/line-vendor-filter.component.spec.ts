import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineVendorFilterComponent } from './line-vendor-filter.component';

describe('LineVendorFilterComponent', () => {
  let component: LineVendorFilterComponent;
  let fixture: ComponentFixture<LineVendorFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineVendorFilterComponent]
    });
    fixture = TestBed.createComponent(LineVendorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
