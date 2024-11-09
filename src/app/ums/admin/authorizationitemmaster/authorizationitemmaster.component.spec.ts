import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationitemmasterComponent } from './authorizationitemmaster.component';

describe('AuthorizationitemmasterComponent', () => {
  let component: AuthorizationitemmasterComponent;
  let fixture: ComponentFixture<AuthorizationitemmasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizationitemmasterComponent]
    });
    fixture = TestBed.createComponent(AuthorizationitemmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
