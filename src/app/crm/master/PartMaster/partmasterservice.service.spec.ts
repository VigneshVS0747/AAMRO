import { TestBed } from '@angular/core/testing';

import { PartmasterserviceService } from './partmasterservice.service';

describe('PartmasterserviceService', () => {
  let service: PartmasterserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartmasterserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
