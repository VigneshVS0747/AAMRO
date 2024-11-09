import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqwithpendingpqReportComponent } from './rfqwithpendingpq-report.component';

describe('RfqwithpendingpqReportComponent', () => {
  let component: RfqwithpendingpqReportComponent;
  let fixture: ComponentFixture<RfqwithpendingpqReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RfqwithpendingpqReportComponent]
    });
    fixture = TestBed.createComponent(RfqwithpendingpqReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
