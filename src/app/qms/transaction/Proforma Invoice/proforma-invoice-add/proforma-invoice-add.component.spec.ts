import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaInvoiceAddComponent } from './proforma-invoice-add.component';

describe('ProformaInvoiceAddComponent', () => {
  let component: ProformaInvoiceAddComponent;
  let fixture: ComponentFixture<ProformaInvoiceAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProformaInvoiceAddComponent]
    });
    fixture = TestBed.createComponent(ProformaInvoiceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
