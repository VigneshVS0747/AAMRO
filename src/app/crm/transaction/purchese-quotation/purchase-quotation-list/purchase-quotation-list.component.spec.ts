import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseQuotationListComponent } from './purchase-quotation-list.component';

describe('PurchaseQuotationListComponent', () => {
  let component: PurchaseQuotationListComponent;
  let fixture: ComponentFixture<PurchaseQuotationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseQuotationListComponent]
    });
    fixture = TestBed.createComponent(PurchaseQuotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
