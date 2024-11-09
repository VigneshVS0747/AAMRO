import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderExpenseBookingListComponent } from './job-order-expense-booking-list.component';

describe('JobOrderExpenseBookingListComponent', () => {
  let component: JobOrderExpenseBookingListComponent;
  let fixture: ComponentFixture<JobOrderExpenseBookingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobOrderExpenseBookingListComponent]
    });
    fixture = TestBed.createComponent(JobOrderExpenseBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
