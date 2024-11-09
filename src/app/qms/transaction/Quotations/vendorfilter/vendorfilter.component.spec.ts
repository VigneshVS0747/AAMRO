import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorfilterComponent } from './vendorfilter.component';

describe('VendorfilterComponent', () => {
  let component: VendorfilterComponent;
  let fixture: ComponentFixture<VendorfilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorfilterComponent]
    });
    fixture = TestBed.createComponent(VendorfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
