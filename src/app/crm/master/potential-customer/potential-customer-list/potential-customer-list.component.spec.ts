import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialCustomerListComponent } from './potential-customer-list.component';

describe('PotentialCustomerListComponent', () => {
  let component: PotentialCustomerListComponent;
  let fixture: ComponentFixture<PotentialCustomerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PotentialCustomerListComponent]
    });
    fixture = TestBed.createComponent(PotentialCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
