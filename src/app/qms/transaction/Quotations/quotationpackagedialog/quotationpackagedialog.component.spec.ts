import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationpackagedialogComponent } from './quotationpackagedialog.component';

describe('QuotationpackagedialogComponent', () => {
  let component: QuotationpackagedialogComponent;
  let fixture: ComponentFixture<QuotationpackagedialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationpackagedialogComponent]
    });
    fixture = TestBed.createComponent(QuotationpackagedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
