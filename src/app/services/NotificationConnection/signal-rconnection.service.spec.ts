import { TestBed } from '@angular/core/testing';

import { SignalRconnectionService } from './signal-rconnection.service';

describe('SignalRconnectionService', () => {
  let service: SignalRconnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalRconnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
