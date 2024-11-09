import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqvendorcontactdialogComponent } from './rfqvendorcontactdialog.component';

describe('RfqvendorcontactdialogComponent', () => {
  let component: RfqvendorcontactdialogComponent;
  let fixture: ComponentFixture<RfqvendorcontactdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RfqvendorcontactdialogComponent]
    });
    fixture = TestBed.createComponent(RfqvendorcontactdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
