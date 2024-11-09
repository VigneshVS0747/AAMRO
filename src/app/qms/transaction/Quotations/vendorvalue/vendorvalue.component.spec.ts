import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorvalueComponent } from './vendorvalue.component';

describe('VendorvalueComponent', () => {
  let component: VendorvalueComponent;
  let fixture: ComponentFixture<VendorvalueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorvalueComponent]
    });
    fixture = TestBed.createComponent(VendorvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
