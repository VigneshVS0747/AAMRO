import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PctocustomerReportComponent } from './pctocustomer-report.component';

describe('PctocustomerReportComponent', () => {
  let component: PctocustomerReportComponent;
  let fixture: ComponentFixture<PctocustomerReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PctocustomerReportComponent]
    });
    fixture = TestBed.createComponent(PctocustomerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
