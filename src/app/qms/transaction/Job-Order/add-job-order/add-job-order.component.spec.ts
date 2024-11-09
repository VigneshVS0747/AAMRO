import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobOrderComponent } from './add-job-order.component';

describe('AddJobOrderComponent', () => {
  let component: AddJobOrderComponent;
  let fixture: ComponentFixture<AddJobOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddJobOrderComponent]
    });
    fixture = TestBed.createComponent(AddJobOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
