import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorContractMappingComponent } from './add-vendor-contract-mapping.component';

describe('AddVendorContractMappingComponent', () => {
  let component: AddVendorContractMappingComponent;
  let fixture: ComponentFixture<AddVendorContractMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVendorContractMappingComponent]
    });
    fixture = TestBed.createComponent(AddVendorContractMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
