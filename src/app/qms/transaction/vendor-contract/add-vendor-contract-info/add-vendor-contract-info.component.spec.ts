import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorContractInfoComponent } from './add-vendor-contract-info.component';

describe('AddVendorContractInfoComponent', () => {
  let component: AddVendorContractInfoComponent;
  let fixture: ComponentFixture<AddVendorContractInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVendorContractInfoComponent]
    });
    fixture = TestBed.createComponent(AddVendorContractInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
