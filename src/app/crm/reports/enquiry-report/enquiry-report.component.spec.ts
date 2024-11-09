import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryReportComponent } from './enquiry-report.component';

describe('EnquiryReportComponent', () => {
  let component: EnquiryReportComponent;
  let fixture: ComponentFixture<EnquiryReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquiryReportComponent]
    });
    fixture = TestBed.createComponent(EnquiryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
