import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCuvComponent } from './customer-cuv.component';

describe('CustomerCuvComponent', () => {
  let component: CustomerCuvComponent;
  let fixture: ComponentFixture<CustomerCuvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCuvComponent]
    });
    fixture = TestBed.createComponent(CustomerCuvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
