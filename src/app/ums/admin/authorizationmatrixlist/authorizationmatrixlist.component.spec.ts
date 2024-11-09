import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationmatrixlistComponent } from './authorizationmatrixlist.component';

describe('AuthorizationmatrixlistComponent', () => {
  let component: AuthorizationmatrixlistComponent;
  let fixture: ComponentFixture<AuthorizationmatrixlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizationmatrixlistComponent]
    });
    fixture = TestBed.createComponent(AuthorizationmatrixlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
