import { TestBed } from '@angular/core/testing';

import { InfosourceService } from './infosource.service';

describe('InfosourceService', () => {
  let service: InfosourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfosourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
