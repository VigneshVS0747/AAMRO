import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobtypecreateComponent } from './jobtypecreate.component';

describe('JobtypecreateComponent', () => {
  let component: JobtypecreateComponent;
  let fixture: ComponentFixture<JobtypecreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobtypecreateComponent]
    });
    fixture = TestBed.createComponent(JobtypecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
