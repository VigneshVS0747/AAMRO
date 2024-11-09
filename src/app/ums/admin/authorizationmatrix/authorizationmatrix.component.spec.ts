import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationmatrixComponent } from './authorizationmatrix.component';

describe('AuthorizationmatrixComponent', () => {
  let component: AuthorizationmatrixComponent;
  let fixture: ComponentFixture<AuthorizationmatrixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizationmatrixComponent]
    });
    fixture = TestBed.createComponent(AuthorizationmatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
