import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyOtpdialogComponent } from './verify-otpdialog.component';

describe('VerifyOtpdialogComponent', () => {
  let component: VerifyOtpdialogComponent;
  let fixture: ComponentFixture<VerifyOtpdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyOtpdialogComponent]
    });
    fixture = TestBed.createComponent(VerifyOtpdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
