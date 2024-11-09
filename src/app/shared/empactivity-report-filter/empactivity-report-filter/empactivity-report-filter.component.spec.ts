import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpactivityReportFilterComponent } from './empactivity-report-filter.component';

describe('EmpactivityReportFilterComponent', () => {
  let component: EmpactivityReportFilterComponent;
  let fixture: ComponentFixture<EmpactivityReportFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpactivityReportFilterComponent]
    });
    fixture = TestBed.createComponent(EmpactivityReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
