import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpwisependingfollowupComponent } from './empwisependingfollowup.component';

describe('EmpwisependingfollowupComponent', () => {
  let component: EmpwisependingfollowupComponent;
  let fixture: ComponentFixture<EmpwisependingfollowupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpwisependingfollowupComponent]
    });
    fixture = TestBed.createComponent(EmpwisependingfollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
