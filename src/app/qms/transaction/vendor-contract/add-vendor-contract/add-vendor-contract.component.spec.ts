import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorContractComponent } from './add-vendor-contract.component';

describe('AddVendorContractComponent', () => {
  let component: AddVendorContractComponent;
  let fixture: ComponentFixture<AddVendorContractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVendorContractComponent]
    });
    fixture = TestBed.createComponent(AddVendorContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
