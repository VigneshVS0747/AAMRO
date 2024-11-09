import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseQuotationGenerateComponent } from './purchase-quotation-generate.component';

describe('PurchaseQuotationGenerateComponent', () => {
  let component: PurchaseQuotationGenerateComponent;
  let fixture: ComponentFixture<PurchaseQuotationGenerateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseQuotationGenerateComponent]
    });
    fixture = TestBed.createComponent(PurchaseQuotationGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
