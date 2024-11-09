import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepassworddialogComponent } from './changepassworddialog.component';

describe('ChangepassworddialogComponent', () => {
  let component: ChangepassworddialogComponent;
  let fixture: ComponentFixture<ChangepassworddialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangepassworddialogComponent]
    });
    fixture = TestBed.createComponent(ChangepassworddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
