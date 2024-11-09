import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationMatrixDialogComponent } from './authorization-matrix-dialog.component';

describe('AuthorizationMatrixDialogComponent', () => {
  let component: AuthorizationMatrixDialogComponent;
  let fixture: ComponentFixture<AuthorizationMatrixDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizationMatrixDialogComponent]
    });
    fixture = TestBed.createComponent(AuthorizationMatrixDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
