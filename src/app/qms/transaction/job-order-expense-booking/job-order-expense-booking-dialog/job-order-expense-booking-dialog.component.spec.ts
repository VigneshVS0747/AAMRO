import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderExpenseBookingDialogComponent } from './job-order-expense-booking-dialog.component';

describe('JobOrderExpenseBookingDialogComponent', () => {
  let component: JobOrderExpenseBookingDialogComponent;
  let fixture: ComponentFixture<JobOrderExpenseBookingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobOrderExpenseBookingDialogComponent]
    });
    fixture = TestBed.createComponent(JobOrderExpenseBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
