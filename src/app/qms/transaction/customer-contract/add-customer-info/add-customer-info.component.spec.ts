import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerInfoComponent } from './add-customer-info.component';

describe('AddCustomerInfoComponent', () => {
  let component: AddCustomerInfoComponent;
  let fixture: ComponentFixture<AddCustomerInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCustomerInfoComponent]
    });
    fixture = TestBed.createComponent(AddCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
