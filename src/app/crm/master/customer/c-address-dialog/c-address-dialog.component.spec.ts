import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAddressDialogComponent } from './c-address-dialog.component';

describe('CAddressDialogComponent', () => {
  let component: CAddressDialogComponent;
  let fixture: ComponentFixture<CAddressDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CAddressDialogComponent]
    });
    fixture = TestBed.createComponent(CAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
