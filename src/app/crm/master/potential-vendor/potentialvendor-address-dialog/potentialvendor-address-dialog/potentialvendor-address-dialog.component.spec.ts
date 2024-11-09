import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialvendorAddressDialogComponent } from './potentialvendor-address-dialog.component';

describe('PotentialvendorAddressDialogComponent', () => {
  let component: PotentialvendorAddressDialogComponent;
  let fixture: ComponentFixture<PotentialvendorAddressDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PotentialvendorAddressDialogComponent]
    });
    fixture = TestBed.createComponent(PotentialvendorAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
