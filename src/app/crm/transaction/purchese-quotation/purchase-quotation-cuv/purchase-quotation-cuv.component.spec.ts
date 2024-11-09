import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseQuotationCuvComponent } from './purchase-quotation-cuv.component';

describe('PurchaseQuotationCuvComponent', () => {
  let component: PurchaseQuotationCuvComponent;
  let fixture: ComponentFixture<PurchaseQuotationCuvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseQuotationCuvComponent]
    });
    fixture = TestBed.createComponent(PurchaseQuotationCuvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
