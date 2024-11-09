import { TestBed } from '@angular/core/testing';

import { SeaportService } from './seaport.service';

describe('SeaportService', () => {
  let service: SeaportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeaportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
