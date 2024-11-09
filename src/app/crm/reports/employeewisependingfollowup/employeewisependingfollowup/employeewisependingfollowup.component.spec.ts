import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeewisependingfollowupComponent } from './employeewisependingfollowup.component';

describe('EmployeewisependingfollowupComponent', () => {
  let component: EmployeewisependingfollowupComponent;
  let fixture: ComponentFixture<EmployeewisependingfollowupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeewisependingfollowupComponent]
    });
    fixture = TestBed.createComponent(EmployeewisependingfollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
