import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRevenueBookingComponent } from './add-revenue-booking.component';

describe('AddRevenueBookingComponent', () => {
  let component: AddRevenueBookingComponent;
  let fixture: ComponentFixture<AddRevenueBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRevenueBookingComponent]
    });
    fixture = TestBed.createComponent(AddRevenueBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
