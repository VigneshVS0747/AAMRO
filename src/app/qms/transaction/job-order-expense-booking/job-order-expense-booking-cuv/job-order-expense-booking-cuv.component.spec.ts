import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderExpenseBookingCuvComponent } from './job-order-expense-booking-cuv.component';

describe('JobOrderExpenseBookingCuvComponent', () => {
  let component: JobOrderExpenseBookingCuvComponent;
  let fixture: ComponentFixture<JobOrderExpenseBookingCuvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobOrderExpenseBookingCuvComponent]
    });
    fixture = TestBed.createComponent(JobOrderExpenseBookingCuvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
