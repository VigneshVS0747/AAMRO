import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoebVendorfilterDialogComponent } from './joeb-vendorfilter-dialog.component';

describe('JoebVendorfilterDialogComponent', () => {
  let component: JoebVendorfilterDialogComponent;
  let fixture: ComponentFixture<JoebVendorfilterDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoebVendorfilterDialogComponent]
    });
    fixture = TestBed.createComponent(JoebVendorfilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
