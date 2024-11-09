import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaInvoiceEditComponent } from './proforma-invoice-edit.component';

describe('ProformaInvoiceEditComponent', () => {
  let component: ProformaInvoiceEditComponent;
  let fixture: ComponentFixture<ProformaInvoiceEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProformaInvoiceEditComponent]
    });
    fixture = TestBed.createComponent(ProformaInvoiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
