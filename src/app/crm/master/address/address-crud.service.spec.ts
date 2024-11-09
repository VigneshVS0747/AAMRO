import { TestBed } from '@angular/core/testing';

import { AddressCrudService } from './address-crud.service';

describe('AddressCrudService', () => {
  let service: AddressCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
