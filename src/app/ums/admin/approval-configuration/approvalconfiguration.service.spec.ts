import { TestBed } from '@angular/core/testing';

import { ApprovalconfigurationService } from '../../../services/ums/approvalconfiguration.service';

describe('ApprovalconfigurationService', () => {
  let service: ApprovalconfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovalconfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
