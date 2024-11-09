import { TestBed } from '@angular/core/testing';

import { NofificationconfigurationService } from '../../../services/ums/nofificationconfiguration.service';

describe('NofificationconfigurationService', () => {
  let service: NofificationconfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NofificationconfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
