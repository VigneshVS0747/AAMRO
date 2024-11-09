import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialvendorContactDialogComponent } from './potentialvendor-contact-dialog.component';

describe('PotentialvendorContactDialogComponent', () => {
  let component: PotentialvendorContactDialogComponent;
  let fixture: ComponentFixture<PotentialvendorContactDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PotentialvendorContactDialogComponent]
    });
    fixture = TestBed.createComponent(PotentialvendorContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
