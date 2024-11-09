import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTypeComponent } from './job-type.component';

describe('JobTypeComponent', () => {
  let component: JobTypeComponent;
  let fixture: ComponentFixture<JobTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobTypeComponent]
    });
    fixture = TestBed.createComponent(JobTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
