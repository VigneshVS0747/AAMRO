import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryDialogComponent } from './expiry-dialog.component';

describe('ExpiryDialogComponent', () => {
  let component: ExpiryDialogComponent;
  let fixture: ComponentFixture<ExpiryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpiryDialogComponent]
    });
    fixture = TestBed.createComponent(ExpiryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
