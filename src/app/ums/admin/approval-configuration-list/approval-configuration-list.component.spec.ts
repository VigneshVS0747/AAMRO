import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalConfigurationListComponent } from './approval-configuration-list.component';

describe('ApprovalConfigurationListComponent', () => {
  let component: ApprovalConfigurationListComponent;
  let fixture: ComponentFixture<ApprovalConfigurationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalConfigurationListComponent]
    });
    fixture = TestBed.createComponent(ApprovalConfigurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
