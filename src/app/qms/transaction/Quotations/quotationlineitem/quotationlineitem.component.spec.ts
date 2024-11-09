import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationlineitemComponent } from './quotationlineitem.component';

describe('QuotationlineitemComponent', () => {
  let component: QuotationlineitemComponent;
  let fixture: ComponentFixture<QuotationlineitemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationlineitemComponent]
    });
    fixture = TestBed.createComponent(QuotationlineitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
