import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeactivityreportComponent } from './employeeactivityreport.component';

describe('EmployeeactivityreportComponent', () => {
  let component: EmployeeactivityreportComponent;
  let fixture: ComponentFixture<EmployeeactivityreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeactivityreportComponent]
    });
    fixture = TestBed.createComponent(EmployeeactivityreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
