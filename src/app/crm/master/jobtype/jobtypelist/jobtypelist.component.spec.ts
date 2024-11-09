import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobtypelistComponent } from './jobtypelist.component';

describe('JobtypelistComponent', () => {
  let component: JobtypelistComponent;
  let fixture: ComponentFixture<JobtypelistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobtypelistComponent]
    });
    fixture = TestBed.createComponent(JobtypelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
