import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaInvoiceFilterComponent } from './proforma-invoice-filter.component';

describe('ProformaInvoiceFilterComponent', () => {
  let component: ProformaInvoiceFilterComponent;
  let fixture: ComponentFixture<ProformaInvoiceFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProformaInvoiceFilterComponent]
    });
    fixture = TestBed.createComponent(ProformaInvoiceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
