import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialCustomerPopupComponent } from './potential-customer-popup.component';

describe('PotentialCustomerPopupComponent', () => {
  let component: PotentialCustomerPopupComponent;
  let fixture: ComponentFixture<PotentialCustomerPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PotentialCustomerPopupComponent]
    });
    fixture = TestBed.createComponent(PotentialCustomerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
