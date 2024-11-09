import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPopupComponent } from './customer-popup.component';

describe('CustomerPopupComponent', () => {
  let component: CustomerPopupComponent;
  let fixture: ComponentFixture<CustomerPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPopupComponent]
    });
    fixture = TestBed.createComponent(CustomerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
