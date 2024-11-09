import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPassworddialogComponent } from './forget-passworddialog.component';

describe('ForgetPassworddialogComponent', () => {
  let component: ForgetPassworddialogComponent;
  let fixture: ComponentFixture<ForgetPassworddialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetPassworddialogComponent]
    });
    fixture = TestBed.createComponent(ForgetPassworddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
