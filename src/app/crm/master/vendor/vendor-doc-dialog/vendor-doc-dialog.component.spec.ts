import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDocDialogComponent } from './vendor-doc-dialog.component';

describe('VendorDocDialogComponent', () => {
  let component: VendorDocDialogComponent;
  let fixture: ComponentFixture<VendorDocDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorDocDialogComponent]
    });
    fixture = TestBed.createComponent(VendorDocDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
