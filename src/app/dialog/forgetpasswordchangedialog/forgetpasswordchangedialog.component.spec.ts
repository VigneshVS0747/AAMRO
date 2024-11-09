import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetpasswordchangedialogComponent } from './forgetpasswordchangedialog.component';

describe('ForgetpasswordchangedialogComponent', () => {
  let component: ForgetpasswordchangedialogComponent;
  let fixture: ComponentFixture<ForgetpasswordchangedialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetpasswordchangedialogComponent]
    });
    fixture = TestBed.createComponent(ForgetpasswordchangedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
