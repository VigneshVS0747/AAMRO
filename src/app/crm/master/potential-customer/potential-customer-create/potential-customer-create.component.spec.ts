import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialCustomerCreateComponent } from './potential-customer-create.component';

describe('PotentialCustomerCreateComponent', () => {
  let component: PotentialCustomerCreateComponent;
  let fixture: ComponentFixture<PotentialCustomerCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PotentialCustomerCreateComponent]
    });
    fixture = TestBed.createComponent(PotentialCustomerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
