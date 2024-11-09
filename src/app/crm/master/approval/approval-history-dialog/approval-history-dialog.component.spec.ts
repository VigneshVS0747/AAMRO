import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalHistoryDialogComponent } from './approval-history-dialog.component';

describe('ApprovalHistoryDialogComponent', () => {
  let component: ApprovalHistoryDialogComponent;
  let fixture: ComponentFixture<ApprovalHistoryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalHistoryDialogComponent]
    });
    fixture = TestBed.createComponent(ApprovalHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
