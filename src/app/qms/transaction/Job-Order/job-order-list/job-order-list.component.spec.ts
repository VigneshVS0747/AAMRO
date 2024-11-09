import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderListComponent } from './job-order-list.component';

describe('JobOrderListComponent', () => {
  let component: JobOrderListComponent;
  let fixture: ComponentFixture<JobOrderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobOrderListComponent]
    });
    fixture = TestBed.createComponent(JobOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
