import { TestBed } from '@angular/core/testing';

import { PartmasterService } from './partmaster.service';

describe('PartmasterService', () => {
  let service: PartmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
