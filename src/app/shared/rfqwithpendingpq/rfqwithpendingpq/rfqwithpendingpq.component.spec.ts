import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqwithpendingpqComponent } from './rfqwithpendingpq.component';

describe('RfqwithpendingpqComponent', () => {
  let component: RfqwithpendingpqComponent;
  let fixture: ComponentFixture<RfqwithpendingpqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RfqwithpendingpqComponent]
    });
    fixture = TestBed.createComponent(RfqwithpendingpqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
