import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalHistoryListComponent } from './approval-history-list.component';

describe('ApprovalHistoryListComponent', () => {
  let component: ApprovalHistoryListComponent;
  let fixture: ComponentFixture<ApprovalHistoryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalHistoryListComponent]
    });
    fixture = TestBed.createComponent(ApprovalHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
