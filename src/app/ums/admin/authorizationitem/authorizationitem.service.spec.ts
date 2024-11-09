import { TestBed } from '@angular/core/testing';
import { AuthorizationitemService } from 'src/app/services/ums/authorizationitem.service';



describe('AuthorizationitemService', () => {
  let service: AuthorizationitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
