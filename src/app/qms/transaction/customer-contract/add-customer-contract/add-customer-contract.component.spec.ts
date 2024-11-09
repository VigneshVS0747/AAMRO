import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerContractComponent } from './add-customer-contract.component';

describe('AddCustomerContractComponent', () => {
  let component: AddCustomerContractComponent;
  let fixture: ComponentFixture<AddCustomerContractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCustomerContractComponent]
    });
    fixture = TestBed.createComponent(AddCustomerContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
