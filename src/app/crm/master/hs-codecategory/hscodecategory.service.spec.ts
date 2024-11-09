import { TestBed } from '@angular/core/testing';

import { HscodecategoryService } from './hscodecategory.service';

describe('HscodecategoryService', () => {
  let service: HscodecategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HscodecategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
