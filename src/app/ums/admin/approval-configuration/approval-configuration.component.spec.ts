import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalConfigurationComponent } from './approval-configuration.component';

describe('ApprovalConfigurationComponent', () => {
  let component: ApprovalConfigurationComponent;
  let fixture: ComponentFixture<ApprovalConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalConfigurationComponent]
    });
    fixture = TestBed.createComponent(ApprovalConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
