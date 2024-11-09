import { TestBed } from '@angular/core/testing';

import { HscodeService } from './hscode.service';

describe('HscodeService', () => {
  let service: HscodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HscodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
