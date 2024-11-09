import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationitemComponent } from './authorizationitem.component';

describe('AuthorizationitemComponent', () => {
  let component: AuthorizationitemComponent;
  let fixture: ComponentFixture<AuthorizationitemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizationitemComponent]
    });
    fixture = TestBed.createComponent(AuthorizationitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
