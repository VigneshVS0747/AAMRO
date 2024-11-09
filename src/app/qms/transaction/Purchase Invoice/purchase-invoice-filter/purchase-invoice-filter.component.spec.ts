import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoiceFilterComponent } from './purchase-invoice-filter.component';

describe('PurchaseInvoiceFilterComponent', () => {
  let component: PurchaseInvoiceFilterComponent;
  let fixture: ComponentFixture<PurchaseInvoiceFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseInvoiceFilterComponent]
    });
    fixture = TestBed.createComponent(PurchaseInvoiceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
