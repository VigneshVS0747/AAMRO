import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerrankingComponent } from './customerranking.component';

describe('CustomerrankingComponent', () => {
  let component: CustomerrankingComponent;
  let fixture: ComponentFixture<CustomerrankingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerrankingComponent]
    });
    fixture = TestBed.createComponent(CustomerrankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
