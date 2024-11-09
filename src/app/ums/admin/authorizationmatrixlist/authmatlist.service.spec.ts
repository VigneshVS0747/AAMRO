import { TestBed } from '@angular/core/testing';

import { AuthmatlistService } from './authmatlist.service';

describe('AuthmatlistService', () => {
  let service: AuthmatlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthmatlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
