import { TestBed } from '@angular/core/testing';

import { PIService } from './pi.service';

describe('PIService', () => {
  let service: PIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
