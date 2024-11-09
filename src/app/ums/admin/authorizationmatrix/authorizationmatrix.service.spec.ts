import { TestBed } from '@angular/core/testing';
import { AuthorizationmatrixService } from 'src/app/services/ums/authorizationmatrix.service';



describe('AuthorizationmatrixService', () => {
  let service: AuthorizationmatrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationmatrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
