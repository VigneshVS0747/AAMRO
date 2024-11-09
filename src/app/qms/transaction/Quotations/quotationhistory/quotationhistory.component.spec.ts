import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationhistoryComponent } from './quotationhistory.component';

describe('QuotationhistoryComponent', () => {
  let component: QuotationhistoryComponent;
  let fixture: ComponentFixture<QuotationhistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationhistoryComponent]
    });
    fixture = TestBed.createComponent(QuotationhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
